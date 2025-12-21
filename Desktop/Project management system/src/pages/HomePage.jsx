import React from 'react';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const HomePage = () => {
    return (
        <div className="home-page fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Build Faster with <span className="text-gradient">Nebula</span>
                        </h1>
                        <p className="hero-subtitle">
                            The ultimate React starter kit for modern web applications.
                            Premium design, optimal performance, and developer experience first.
                        </p>
                        <div className="hero-actions">
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Start Building <ArrowRight size={20} className="icon-right" />
                            </Link>
                            <Link to="/features" className="btn btn-secondary btn-lg">
                                Learn More
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">100+</span>
                                <span className="stat-label">Components</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">99%</span>
                                <span className="stat-label">Performance</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">5k+</span>
                                <span className="stat-label">Developers</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="code-window">
                            <div className="window-header">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                            </div>
                            <div className="window-content">
                                <pre>
                                    <code>
                                        <span className="keyword">const</span> <span className="function">App</span> = () =&gt; &#123;
                                        <span className="keyword">return</span> (
                                        &lt;<span className="component">Nebula</span>&gt;
                                        &lt;<span className="component">PremiumUI</span> /&gt;
                                        &lt;<span className="component">Performance</span> /&gt;
                                        &lt;/<span className="component">Nebula</span>&gt;
                                        );
                                        &#125;
                                    </code>
                                </pre>
                            </div>
                        </div>
                        <div className="glow-effect"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose Nebula?</h2>
                        <p>Everything you need to ship your next big project.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Zap size={32} />
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Built on Vite for instant server start and HMR.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3>Production Ready</h3>
                            <p>Best practices for SEO, accessibility, and performance.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3>Premium Design</h3>
                            <p>Beautiful UI components crafted with attention to detail.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
