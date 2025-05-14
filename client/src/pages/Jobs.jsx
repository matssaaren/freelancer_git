import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Jobs.css';

function Jobs() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/posts');
        const data = await res.json();
        setAllPosts(data);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

 return (
  <div className="jobs-container">
    <div className="bubble bubble1"></div>
    <div className="bubble bubble2"></div>
    <div className="bubble bubble3"></div>
    <div className="bubble bubble4"></div>

    <h2>Available Jobs</h2>

    {/* Search and Filters */}
    <div className="job-search-bar">
  <input
    type="text"
    placeholder="Search jobs..."
    value={searchTerm}
    onChange={(e) => {
      const term = e.target.value;
      setSearchTerm(term);

      if (term === '') {
        setPosts(allPosts); // Reset if empty
        return;
      }

      const filtered = allPosts.filter((post) => {
        const fullName = `${post.first_name} ${post.last_name}`.toLowerCase();
        return (
          post.title.toLowerCase().includes(term.toLowerCase()) ||
          post.description.toLowerCase().includes(term.toLowerCase()) ||
          fullName.includes(term.toLowerCase())
        );
      });

      setPosts(filtered);
    }}
  />
  {searchTerm && (
    <button className="clear-search-btn" onClick={() => {
      setSearchTerm('');
      setPosts(allPosts);
    }}>
      ✕
    </button>
  )}
</div>


    {/* Scrollable Jobs Section */}
    <div className="jobs-scroll-container">
      <div className="jobs-list">
        {posts.length > 0 ? (
          posts.map((post, index) => {
            const shortName = `${post.first_name.charAt(0)}. ${post.last_name}`;
            let usernameURL = `${post.first_name}-${post.last_name}`;
            if (user && post.user_id === user.id) usernameURL = '';

            return (
              <div
                key={post.post_id}
                className="job-card"
                style={{ '--i': `${index * 0.1}s` }}
              >
                <div className="job-user-info">
                  <img
                    src={
                      post.avatar
                        ? post.avatar.startsWith('http')
                          ? post.avatar
                          : `http://localhost:5000/${post.avatar}`
                        : 'https://placehold.co/50x50/png'
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
                <p>
                  {post.description.length > 100
                    ? post.description.slice(0, 100) + '...'
                    : post.description}
                </p>
                <p><strong>Date:</strong> {new Date(post.upload_date).toLocaleDateString()}</p>
                <Link to={`/posts/${post.post_id}`} className="view-job-link">
                  View Details
                </Link>
              </div>
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </div>
    </div>
  </div>
);

}

export default Jobs;
