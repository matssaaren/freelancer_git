import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobPost from '../components/JobPost';

import './Jobs.css';

function Jobs() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const categories = ['All', 'Web Development', 'Design', 'Marketing', 'Writing', 'Video Editing'];
  

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
    <select value={selectedCategory} onChange={(e) => {
      const value = e.target.value;
      setSelectedCategory(value);
      if (value === 'All') {
        setPosts(allPosts);
      } else {
        setPosts(allPosts.filter(post => post.category === value));
      }
    }}>
      {categories.map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>

</div>


    {/* Scrollable Jobs Section */}
    <div className="jobs-scroll-container">
      <div className="jobs-list">
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

export default Jobs;
