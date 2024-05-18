import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
	@Output() claimGenerationResponseEvent = new EventEmitter<{
		type: RequestStatusType;
		message: string;
	}>();

	private selectedReceipt!: File;

	readonly claimTypes = ClaimType;
	readonly currencies = Currency;

	claimGenerationRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	claimGenerationForm: FormGroup = this._formBuilder.nonNullable.group({
		date: new FormControl<Date | null>(null, [Validators.required]),
		type: new FormControl<string>('', [Validators.required]),
		requestedAmt: new FormControl<number>(0, [Validators.required]),
		currency: new FormControl<string>('', [Validators.required]),
		receipt: new FormControl<File | null>(null, [Validators.required]),
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
				this.setClaimGenerationRequestStatus(RequestStatusType.SUCCESS, response.message);
				this.claimGenerationResponseEvent.emit(this.claimGenerationRequestStatus);
			},
			error: (error: HttpErrorResponse) => {
				this.setClaimGenerationRequestStatus(RequestStatusType.ERROR, error.message);
				this.claimGenerationResponseEvent.emit(this.claimGenerationRequestStatus);
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
