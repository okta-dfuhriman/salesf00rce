import ProfileCard from '../../components/ProfileCard';
import { aridDunes } from '../../common';
import './styles.css';

const Profile = () => {
	document.body.id = 'profile';

	return (
		<div className='root'>
			<div className='banner' style={{ backgroundImage: `url(${aridDunes})` }}></div>
			<div className='container'>
				<div className='desktop'>
					<div className='left'>
						<ProfileCard />
					</div>
					<div className='right'></div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
