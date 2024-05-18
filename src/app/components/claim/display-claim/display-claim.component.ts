import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClaimService } from '../../../services';
import { DeleteClaimResponseDto, FetchClaimResponseDto } from '../../../../dtos';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateClaimComponent } from '../create-claim/create-claim.component';
import { RequestStatusType } from '../../../../enums';
import { UpdateClaimComponent } from '../update-claim/update-claim.component';
import { ApproveClaimComponent } from '../approve-claim/approve-claim.component';
import { DeclineClaimComponent } from '../decline-claim/decline-claim.component';

@Component({
	selector: 'app-display-claim',
	standalone: true,
	imports: [
		CommonModule,
		CreateClaimComponent,
		UpdateClaimComponent,
		ApproveClaimComponent,
		DeclineClaimComponent,
	],
	templateUrl: './display-claim.component.html',
	styleUrl: './display-claim.component.css',
})
export class DisplayClaimComponent implements OnInit {
	constructor(
		private readonly _activatedRoute: ActivatedRoute,
		private readonly _claimService: ClaimService,
	) {}

	claimGenerationRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	updateClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	approveClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	declineClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	deleteClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	fetchClaimRequestStatus = {
		type: RequestStatusType.NONE,
		message: '',
	};
	loggedInUserRole: string = this._activatedRoute.snapshot.data['role'];
	claims: FetchClaimResponseDto[] = [];
	claimToUpdate: FetchClaimResponseDto = {};
	claimToApprove: FetchClaimResponseDto = {};
	claimToDecline: FetchClaimResponseDto = {};

	ngOnInit(): void {
		if (this.loggedInUserRole === 'Admin') {
			this._claimService.fetchAllClaims().subscribe({
				next: (response: FetchClaimResponseDto[]) => {
					this.claims = response;
					window.localStorage.setItem('claims', JSON.stringify(response));
				},
				error: (error: HttpErrorResponse) => {},
			});
		} else if (this.loggedInUserRole === 'User') {
			this._claimService.fetchUserClaims().subscribe({
				next: (response: FetchClaimResponseDto[]) => {
					this.claims = response;
					window.localStorage.setItem('claims', JSON.stringify(response));
				},
				error: (error: HttpErrorResponse) => {},
			});
		}
	}

	onClaimGenerationEvent(requestStatus: { type: RequestStatusType; message: string }) {
		if (requestStatus.type === RequestStatusType.SUCCESS) {
			if (this.loggedInUserRole === 'Admin') {
				this._claimService.fetchAllClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			} else if (this.loggedInUserRole === 'User') {
				this._claimService.fetchUserClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			}
		}

		this.setClaimGenerationRequestStatus(requestStatus);
	}

	onClaimUpdatedEvent(requestStatus: { type: RequestStatusType; message: string }) {
		if (requestStatus.type === RequestStatusType.SUCCESS) {
			if (this.loggedInUserRole === 'Admin') {
				this._claimService.fetchAllClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			} else if (this.loggedInUserRole === 'User') {
				this._claimService.fetchUserClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			}
		}

		this.setUpdateClaimRequestStatus(requestStatus);
	}

	onClaimApproveEvent(requestStatus: { type: RequestStatusType; message: string }) {
		if (requestStatus.type === RequestStatusType.SUCCESS) {
			if (this.loggedInUserRole === 'Admin') {
				this._claimService.fetchAllClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			} else if (this.loggedInUserRole === 'User') {
				this._claimService.fetchUserClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			}
		}

		this.setApproveClaimRequestStatus(requestStatus);
	}

	onClaimDeclineEvent(requestStatus: { type: RequestStatusType; message: string }) {
		if (requestStatus.type === RequestStatusType.SUCCESS) {
			if (this.loggedInUserRole === 'Admin') {
				this._claimService.fetchAllClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			} else if (this.loggedInUserRole === 'User') {
				this._claimService.fetchUserClaims().subscribe({
					next: (response: FetchClaimResponseDto[]) => {
						this.claims = response;
						window.localStorage.setItem('claims', JSON.stringify(response));
					},
					error: (error: HttpErrorResponse) => {},
				});
			}
		}

		this.setDeclineClaimRequestStatus(requestStatus);
	}

	setClaimGenerationRequestStatus(requestStatus: { type: RequestStatusType; message: string }) {
		this.claimGenerationRequestStatus = requestStatus;
	}

	resetClaimGenerationRequestStatus() {
		this.claimGenerationRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	setUpdateClaimRequestStatus(requestStatus: { type: RequestStatusType; message: string }) {
		this.updateClaimRequestStatus = requestStatus;
	}

	resetUpdateClaimRequestStatus() {
		this.updateClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	setApproveClaimRequestStatus(requestStatus: { type: RequestStatusType; message: string }) {
		this.approveClaimRequestStatus = requestStatus;
	}

	resetApproveClaimRequestStatus() {
		this.approveClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	setDeclineClaimRequestStatus(requestStatus: { type: RequestStatusType; message: string }) {
		this.declineClaimRequestStatus = requestStatus;
	}

	resetDeclineClaimRequestStatus() {
		this.declineClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	setDeleteClaimRequestStatus(type: RequestStatusType, message: string) {
		this.deleteClaimRequestStatus = {
			type,
			message,
		};
	}

	resetDeleteClaimRequestStatus() {
		this.deleteClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	setFetchClaimRequestStatus(requestStatus: { type: RequestStatusType; message: string }) {
		this.fetchClaimRequestStatus = requestStatus;
	}

	resetFetchClaimRequestStatus() {
		this.fetchClaimRequestStatus = {
			type: RequestStatusType.NONE,
			message: '',
		};
	}

	// specific to a non-admin user
	update(claimId: string) {
		this.claimToUpdate = this.claims.filter(
			(claim: FetchClaimResponseDto) => claimId === claim.id,
		)[0];
	}

	delete(claimId: string) {
		this._claimService.deleteClaim(claimId).subscribe({
			next: (response: DeleteClaimResponseDto) => {
				this.claims = this.claims.filter((claim: FetchClaimResponseDto) => claimId === claim.id);
				this.setDeleteClaimRequestStatus(RequestStatusType.SUCCESS, response.message);
			},
			error: (error: HttpErrorResponse) => {
				this.setDeleteClaimRequestStatus(RequestStatusType.ERROR, error.message);
			},
		});
	}

	// specific to only admin
	approve(claimId: string) {
		this.claimToApprove = this.claims.filter(
			(claim: FetchClaimResponseDto) => claimId === claim.id,
		)[0];
	}
	decline(claimId: string) {
		this.claimToDecline = this.claims.filter(
			(claim: FetchClaimResponseDto) => claimId === claim.id,
		)[0];
	}
}
