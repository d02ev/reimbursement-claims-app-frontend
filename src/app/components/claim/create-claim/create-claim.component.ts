import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	FormBuilder,
	Validators,
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	AbstractControl,
} from '@angular/forms';
import { ClaimType, Currency, RequestStatusType } from '../../../../enums';
import { ClaimService } from '../../../services';
import { CreateClaimResponseDto } from '../../../../dtos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-create-claim',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './create-claim.component.html',
	styleUrl: './create-claim.component.css',
})
export class CreateClaimComponent {
	constructor(
		private readonly _formBuilder: FormBuilder,
		private readonly _claimService: ClaimService,
	) {}

	@Input({ required: true }) modalId: string = '';

	private selectedReceipt!: File;

	readonly claimTypes = ClaimType;
	readonly currencies = Currency;

	claimGenerationRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	claimGenerationForm: FormGroup = this._formBuilder.nonNullable.group({
		date: new FormControl('', [Validators.required]),
		type: new FormControl('', [Validators.required]),
		requestedAmt: new FormControl('', [Validators.required]),
		currency: new FormControl('', [Validators.required]),
		receipt: new FormControl(null, [Validators.required]),
	});

	onFileSelect(event: any) {
		this.selectedReceipt = event.target.files[0];
	}

	submitClaimGenerationForm(event: SubmitEvent): void {
		event.preventDefault();
		const formData = new FormData();

		Object.entries(this.claimGenerationForm.value).forEach((value) => {
			value[0] === 'receipt'
				? formData.append(value[0], this.selectedReceipt, this.selectedReceipt?.name)
				: formData.append(value[0], value[1] as string);
		});

		this._claimService.createClaim(formData).subscribe({
			next: (response: CreateClaimResponseDto) => {
				// modal closes
				// parent component refreshes
				// success message emitted
			},
			error: (error: HttpErrorResponse) => {
				// modal closes
				// no refresh
				// error message emitted
			},
		});
	}

	getClaimGenerationFormControl(controlName: string): AbstractControl | null {
		return this.claimGenerationForm.get(controlName);
	}

	getClaimGenerationFormControlState(controlName: string): { [key: string]: boolean | undefined } {
		const formControlName = this.claimGenerationForm.get(controlName);
		return {
			isInvalid: formControlName?.invalid,
			isTouched: formControlName?.touched,
			isDirty: formControlName?.dirty,
			isTouchedOrDirty: formControlName?.touched || formControlName?.dirty,
			isInvalidAndTouched: formControlName?.invalid && formControlName?.touched,
			isValidAndTouched: !formControlName?.invalid && formControlName?.touched,
		};
	}

	getClaimGenerationFormControlError(
		controlName: string,
		validationErrorType: string,
	): boolean | undefined | null {
		return (
			this.claimGenerationForm.get(controlName)?.hasError(validationErrorType) ||
			this.claimGenerationForm.errors?.[validationErrorType]
		);
	}

	setClaimGenerationRequestStatus(type: RequestStatusType, message: string): void {
		this.claimGenerationRequestStatus = {
			type,
			message,
		};
	}

	resetClaimGenerationRequestStatus(): void {
		this.claimGenerationRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}
}
