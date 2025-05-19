import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Profile.css'; // Reuse your profile styles!
import JobPost from '../components/JobPost';



function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    async function fetchPublicProfile() {
      try {
        const res = await fetch(`http://localhost:5000/profile/${username}`);

        if (!res.ok) {
          throw new Error('Profile not found');
        }

        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error('Public profile fetch error:', error);
        navigate('/404');
      }
    }
    fetchPublicProfile();
    fetchMyPosts();

  }, [username, navigate]);

  async function fetchMyPosts() {
    try {
      const res = await fetch(`http://localhost:5000/posts/user/${username}`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  }

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
  <div className="profile-container">
    <div className="profile-grid">
      
      {/* Public Profile Info */}
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
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
        <p><strong>Date of Birth:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not set'}</p>
        <p><strong>Bio:</strong> {user.bio || 'No bio yet'}</p>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        <h3>My Posts</h3>
        {posts.map((post, index) => (
          <div key={post.post_id} style={{ '--i': `${index * 0.1}s` }}>
            <JobPost post={post} user={user} />
          </div>
        ))}

      </div>
    </div>
  </div>
);

}

export default PublicProfile;
