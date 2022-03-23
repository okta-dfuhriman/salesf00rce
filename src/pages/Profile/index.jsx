import ProfileCard from '../../components/ProfileCard';
import './styles.css';

const Profile = () => {
	return (
		<div className='root'>
			<div
				className='banner'
				style={{ backgroundImage: "url('/assets/images/arid-dunes.png')" }}
			></div>
			<div className='container'>
				<div className='desktop'>
					<div className='left'>{/* <ProfileCard /> */}</div>
					<div className='right'></div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
