import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import '../styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-brand">
                    <h3>Nebula</h3>
                    <p>Building the future of digital experiences.</p>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Product</h4>
                        <a href="#">Features</a>
                        <a href="#">Integrations</a>
                        <a href="#">Pricing</a>
                    </div>
                    <div className="link-group">
                        <h4>Company</h4>
                        <a href="#">About</a>
                        <a href="#">Careers</a>
                        <a href="#">Blog</a>
                    </div>
                    <div className="link-group">
                        <h4>Legal</h4>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Nebula Inc. All rights reserved.</p>
                    <div className="social-links">
                        <a href="#" aria-label="Github"><Github size={20} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" aria-label="LinkedIn"><Linkedin size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
