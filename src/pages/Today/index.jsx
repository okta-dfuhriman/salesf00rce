import { Auth, LDS, trailheadBanner, trailheadBasics, trailheadFirstStep } from '../../common';

const TodayPage = () => {
	const { profile } = Auth.useAuthState();

	return (
		<div className='root'>
			<div
				className='slds-size_1-of-1 tds-bg_white th-hero--custom'
				style={{ backgroundImage: `url(${trailheadBanner})` }}
			></div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					marginTop: '-90px',
					marginBottom: '-10px',
				}}
			>
				<div style={{ width: '130px' }}>
					<LDS.Avatar
						imgSrc={profile?.picture ?? 'assets/images/astro.svg'}
						imgAlt='avatar'
						size='large'
					/>
				</div>
				<h1 className='tds-text-heading_neutraface-large slds-text-align_center slds-p-around--medium slds-m-bottom_medium'>
					{profile ? `${profile?.firstName}, ` : ' '}let's learn something new today!
				</h1>
				<div style={{ minHeight: '600px' }}>
					<div>
						<div
							className='slds-container_medium slds-container_center slds-p-bottom_x-large'
							style={{ minHeight: '600px' }}
						>
							<div>
								<div className='th-first-steps-container slds-m-horizontal_medium slds-p-around_medium'>
									<div className='slds-text-heading_medium tds-text-size_6 slds-m-top_x-small slds-m-bottom_large'>
										Get Started with Trailhead and the Trailblazer Community
									</div>
									<div>
										<div className='th-first-step'>
											<div className='th-first-step-image'>
												<img alt='first-step' src={trailheadFirstStep} />
												<div className='tds-dotted-trail'></div>
											</div>
											<div className='th-first-step-content th-first-step-content_bottom-bordered'>
												<div>
													<div className='slds-text-title'>Intro • ~ 2min</div>
													<a
														href='#'
														className='slds-text-heading_small tds-text_bold tds-color_brand'
														style={{ textDecoration: 'none' }}
													>
														Why Trailhead and the Trailblazer Community?
													</a>
													<div className='slds-text-body_small'>
														Discover how Trailhead and Trailblazer Community empower you to learn,
														earn, and connect from anywhere.
													</div>
												</div>
												<LDS.Button label='Read' className='tds-button_neutral' />
											</div>
										</div>
										<div className='th-first-step'>
											<div className='th-first-step-image'>
												<img
													alt='first-step'
													src={trailheadBasics}
													className='th-first-step-image_grayscale'
												/>
											</div>
											<div className='th-first-step-content'>
												<div>
													<div className='slds-text-title'>Module • ~ 15min</div>
													<h2 className='slds-text-heading_small tds-text_bold tds-color_meteorite'>
														Trailhead and Trailblazer Community Basics
													</h2>
													<div className='slds-text-body_small'>
														Get a more detailed introduction on how Trailhead and the Trailblazer
														Community work.
													</div>
												</div>
												<LDS.Button label='Learn' disabled className='tds-button_neutral' />
											</div>
										</div>
									</div>
								</div>
								<div className='th-simplified-homepage tds-dotted-trail'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TodayPage;
