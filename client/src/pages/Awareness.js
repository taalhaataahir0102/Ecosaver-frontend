import React, { useEffect, useState } from 'react';
import './Awareness.css';
import Header from './Header';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/signin';
          return;
        }
        
        const userResponse = await fetch('https://ecosaver-backend-bhkj4m9ld-taalhaataahir0102.vercel.app/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(userResponse);
        
        if (!userResponse.ok) {
          window.location.href = '/signin';
          return;
        }
        
        //const userData = await userResponse.json();
        
        const articleResponse = await fetch('https://newsapi.org/v2/everything?q=ecosystem&apiKey=36f6b80f9cb4490887d85211cb74547e');
        const articleData = await articleResponse.json();
        
        setArticles(articleData.articles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };
  
    fetchArticles();
  }, []);

  return (
    <div className="news-container">
      <Header />
      <div className="news-content">
        <h2>Ecosystem News</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="articles-container">
            {articles.map((article, index) => (
              <div key={index} className="article-card">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-link">
                  <h3 className="article-title">{article.title}</h3>
                </a>
                <p className="article-description">{article.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
