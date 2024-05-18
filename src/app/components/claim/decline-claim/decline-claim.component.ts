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
	DeclineClaimRequestDto,
	DeclineClaimResponseDto,
	FetchClaimResponseDto,
} from '../../../../dtos';
import { RequestStatusType } from '../../../../enums';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-decline-claim',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './decline-claim.component.html',
	styleUrl: './decline-claim.component.css',
})
export class DeclineClaimComponent {
	constructor(
		private readonly _formBuilder: FormBuilder,
		private readonly _claimService: ClaimService,
	) {}

	@Input({ required: true }) modalId: string = '';
	@Input({ required: true }) claimId: string = '';
	@Input({ required: true }) claim: FetchClaimResponseDto = {};
	@Output() declineClaimResponseEvent = new EventEmitter<{
		type: RequestStatusType;
		message: string;
	}>();

	declineClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	declineClaimForm: FormGroup = this._formBuilder.group({
		notes: new FormControl<string>(''),
	});

	submitDeclineClaimForm(event: SubmitEvent) {
		event.preventDefault();
		const declineClaimRequestDto: DeclineClaimRequestDto = { ...this.declineClaimForm.value };

		this._claimService.declineClaim(this.claimId, declineClaimRequestDto).subscribe({
			next: (response: DeclineClaimResponseDto) => {
				this.setDeclineClaimRequestStatus(RequestStatusType.SUCCESS, response.message);
				this.declineClaimResponseEvent.emit(this.declineClaimRequestStatus);
			},
			error: (error: HttpErrorResponse) => {
				this.setDeclineClaimRequestStatus(RequestStatusType.ERROR, error.message);
				this.declineClaimResponseEvent.emit(this.declineClaimRequestStatus);
			},
			complete: () => {
				this.resetDeclineClaimRequestStatus();
			},
		});
	}

	getDeclineClaimFormControl(controlName: string) {
		return this.declineClaimForm.get(controlName);
	}

	getDeclineClaimFormControlState(controlName: string) {
		const formControlName = this.declineClaimForm.get(controlName);
		return {
			isInvalid: formControlName?.invalid,
			isTouched: formControlName?.touched,
			isDirty: formControlName?.dirty,
			isTouchedOrDirty: formControlName?.touched || formControlName?.dirty,
			isInvalidAndTouched: formControlName?.invalid && formControlName?.touched,
			isValidAndTouched: !formControlName?.invalid && formControlName?.touched,
		};
	}

	getDeclineClaimFormControlError(controlName: string, validationErrorType: string) {
		return (
			this.declineClaimForm.get(controlName)?.hasError(validationErrorType) ||
			this.declineClaimForm.errors?.[validationErrorType]
		);
	}

	private setDeclineClaimRequestStatus(type: RequestStatusType, message: string) {
		this.declineClaimRequestStatus = {
			type,
			message,
		};
	}

	private resetDeclineClaimRequestStatus() {
		this.declineClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}
}
