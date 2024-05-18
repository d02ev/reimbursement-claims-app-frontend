import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
	FormBuilder,
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	AbstractControl,
} from '@angular/forms';
import { ClaimService } from '../../../services';
import { ClaimType, Currency, RequestStatusType } from '../../../../enums';
import { FetchClaimResponseDto, UpdateClaimResponseDto } from '../../../../dtos';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-update-claim',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './update-claim.component.html',
	styleUrl: './update-claim.component.css',
})
export class UpdateClaimComponent implements OnChanges {
	constructor(
		private readonly _formBuilder: FormBuilder,
		private readonly _claimService: ClaimService,
	) {}

	@Input({ required: true }) modalId: string = '';
	@Input({ required: true }) claimId: string = '';
	@Input({ required: true }) claim: FetchClaimResponseDto = {};
	@Output() updateClaimResponseEvent = new EventEmitter<{
		type: RequestStatusType;
		message: string;
	}>();

	private selectedReceipt: File | null = null;

	readonly claimTypes = ClaimType;
	readonly currencies = Currency;

	updateClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	updateClaimForm: FormGroup = this._formBuilder.group({
		date: new FormControl<string>(''),
		type: new FormControl<string>(''),
		requestedAmt: new FormControl<number>(0),
		currency: new FormControl<string>(''),
		receipt: new FormControl<File | null>(null),
	});

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['claim'].isFirstChange() && !changes['claimId'].isFirstChange()) {
			this.updateClaimForm.patchValue({
				date: formatDate(new Date(this.claim.date!), 'yyyy-MM-dd', 'en'),
				type: this.claim.type!,
				requestedAmt: Number(this.claim.requestedAmt!),
				currency: this.claim.currency!,
				receipt: null,
			});
		}
	}

	onFileSelect(event: any) {
		this.selectedReceipt = event.target.files[0];
	}

	submitUpdateClaimForm(event: SubmitEvent): void {
		event.preventDefault();
		const formData = new FormData();

		Object.entries(this.updateClaimForm.value).forEach((value) => {
			value[0] === 'receipt' && value[1]
				? formData.append(value[0], this.selectedReceipt!, this.selectedReceipt?.name)
				: formData.append(value[0], value[1] as string);
		});

		this._claimService.updateClaim(this.claimId, formData).subscribe({
			next: (response: UpdateClaimResponseDto) => {
				this.setUpdateClaimRequestStatus(RequestStatusType.SUCCESS, response.message);
				this.updateClaimResponseEvent.emit(this.updateClaimRequestStatus);
			},
			error: (error: HttpErrorResponse) => {
				this.setUpdateClaimRequestStatus(RequestStatusType.ERROR, error.message);
				this.updateClaimResponseEvent.emit(this.updateClaimRequestStatus);
			},
		});
	}

	getUpdateClaimFormControl(controlName: string): AbstractControl | null {
		return this.updateClaimForm.get(controlName);
	}

	getUpdateClaimFormControlState(controlName: string): { [key: string]: boolean | undefined } {
		const formControlName = this.updateClaimForm.get(controlName);
		return {
			isInvalid: formControlName?.invalid,
			isTouched: formControlName?.touched,
			isDirty: formControlName?.dirty,
			isTouchedOrDirty: formControlName?.touched || formControlName?.dirty,
			isInvalidAndTouched: formControlName?.invalid && formControlName?.touched,
			isValidAndTouched: !formControlName?.invalid && formControlName?.touched,
		};
	}

	getUpdateClaimFormControlError(
		controlName: string,
		validationErrorType: string,
	): boolean | undefined | null {
		return (
			this.updateClaimForm.get(controlName)?.hasError(validationErrorType) ||
			this.updateClaimForm.errors?.[validationErrorType]
		);
	}

	setUpdateClaimRequestStatus(type: RequestStatusType, message: string): void {
		this.updateClaimRequestStatus = {
			type,
			message,
		};
	}

	resetUpdateClaimRequestStatus(): void {
		this.updateClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	// private formatDate(inputDate: string): string {
	// 	const date = new Date(inputDate);
	// 	const day = String(date.getDate()).padStart(2, '0');
	// 	const month = String(date.getMonth()).padStart(2, '0');
	// 	const year = date.getFullYear();

	// 	return `${day}/${month}/${year}`;
	// }
}
