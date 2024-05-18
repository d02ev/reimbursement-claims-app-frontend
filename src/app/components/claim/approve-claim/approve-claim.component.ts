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
import { ClaimService } from '../../../services';
import {
	ApproveClaimRequestDto,
	ApproveClaimResponseDto,
	FetchClaimResponseDto,
} from '../../../../dtos';
import { RequestStatusType } from '../../../../enums';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-approve-claim',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './approve-claim.component.html',
	styleUrl: './approve-claim.component.css',
})
export class ApproveClaimComponent {
	constructor(
		private readonly _formBuilder: FormBuilder,
		private readonly _claimService: ClaimService,
	) {}

	@Input({ required: true }) modalId: string = '';
	@Input({ required: true }) claimId: string = '';
	@Input({ required: true }) claim: FetchClaimResponseDto = {};
	@Output() approveClaimResponseEvent = new EventEmitter<{
		type: RequestStatusType;
		message: string;
	}>();

	approveClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	approveClaimForm: FormGroup = this._formBuilder.group({
		approvedAmt: new FormControl<string>('', [Validators.required]),
	});

	submitApproveClaimForm(event: SubmitEvent) {
		event.preventDefault();
		const approveClaimRequestDto: ApproveClaimRequestDto = { ...this.approveClaimForm.value };

		this._claimService.approveClaim(this.claimId, approveClaimRequestDto).subscribe({
			next: (response: ApproveClaimResponseDto) => {
				this.setApproveClaimRequestStatus(RequestStatusType.SUCCESS, response.message);
				this.approveClaimResponseEvent.emit(this.approveClaimRequestStatus);
			},
			error: (error: HttpErrorResponse) => {
				this.setApproveClaimRequestStatus(RequestStatusType.ERROR, error.message);
				this.approveClaimResponseEvent.emit(this.approveClaimRequestStatus);
			},
			complete: () => {
				this.resetApproveClaimRequestStatus();
			},
		});
	}

	getApproveClaimFormControl(controlName: string) {
		return this.approveClaimForm.get(controlName);
	}

	getApproveClaimFormControlState(controlName: string) {
		const formControlName = this.approveClaimForm.get(controlName);
		return {
			isInvalid: formControlName?.invalid,
			isTouched: formControlName?.touched,
			isDirty: formControlName?.dirty,
			isTouchedOrDirty: formControlName?.touched || formControlName?.dirty,
			isInvalidAndTouched: formControlName?.invalid && formControlName?.touched,
			isValidAndTouched: !formControlName?.invalid && formControlName?.touched,
		};
	}

	getApproveClaimFormControlError(controlName: string, validationErrorType: string) {
		return (
			this.approveClaimForm.get(controlName)?.hasError(validationErrorType) ||
			this.approveClaimForm.errors?.[validationErrorType]
		);
	}

	private setApproveClaimRequestStatus(type: RequestStatusType, message: string) {
		this.approveClaimRequestStatus = {
			type,
			message,
		};
	}

	private resetApproveClaimRequestStatus() {
		this.approveClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}
}
