import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import JobPost from '../components/JobPost';

function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }

    if (user) {
      fetchMyPosts();
    }
  }, [user, loading, navigate]);

  async function fetchMyPosts() {
    try {
      const username = user.name.split(' ').join('-');
      const res = await fetch(`http://localhost:5000/posts/user/${username}`);
      const data = await res.json();
      setMyPosts(data);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  }

  if (loading) return <p>Loading profile...</p>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-grid">
        
        {/* Profile Section */}
        <div className="profile-section">
          <img
            src={
              user.avatar
                ? user.avatar.startsWith('http')
                  ? user.avatar
                  : `http://localhost:5000/${user.avatar}`
                : 'https://placehold.co/150/png'
            }
            alt="User Avatar"
            className="avatar"
          />
          <h2>{user.name}</h2>
          
          {user.email && <p><strong>Email:</strong> {user.email}</p>}
          {user.phone && <p><strong>Email:</strong> {user.phone}</p>}
          {user.dob && <p><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>}
          
          <p><strong>Bio:</strong> {user.bio || 'No bio yet'}</p>

          <div className="profile-actions">
            <Link to="/edit-profile" className="profile-action-btn edit-btn">Edit Profile</Link>
            <Link to="/create-post" className="profile-action-btn create-btn">Create Post</Link>
          </div>
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <h3>My Posts</h3>
          {myPosts.map((post, index) => (
            <div key={post.post_id} style={{ '--i': `${index * 0.1}s` }}>
              <JobPost post={post} user={user} />
            </div>
          ))}

        </div>
        
      </div>
    </div>
  );
}

export default Profile;
