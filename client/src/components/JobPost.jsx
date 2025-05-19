import { Link } from 'react-router-dom';
// import './JobPost.css';

function JobPost({ post, user }) {
  const shortName = `${post.first_name.charAt(0)}. ${post.last_name}`;
  let usernameURL = `${post.first_name}-${post.last_name}`;
  if (user && post.user_id === user.id) usernameURL = '';

  return (
    <div className="job-card">
      <div className="job-user-info">
        <img
          src={
            post.avatar?.startsWith('http')
              ? post.avatar
              : `http://localhost:5000/${post.avatar || ''}`
          }
          alt="User Avatar"
          className="job-user-avatar"
        />
        {usernameURL ? (
          <Link to={`/profile/${usernameURL}`} className="job-user-name">
            {shortName}
          </Link>
        ) : (
          <span className="job-user-name">{shortName}</span>
        )}
      </div>

      <h3>{post.title}</h3>
      <p>{post.description.length > 100 ? post.description.slice(0, 100) + '...' : post.description}</p>
      {post.category && <p><strong>Category:</strong> {post.category}</p>}
      <p><strong>Date:</strong> {new Date(post.upload_date).toLocaleDateString()}</p>
      <Link to={`/posts/${post.post_id}`} className="view-job-link">View Details</Link>
    </div>
  );
}

export default JobPost;
