import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t pt-10 pb-6">
      <div className="flex justify-between items-center">
        <div className="text-left space-y-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{' '}
            <a
              href="https://github.com/yassenshopov"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity underline"
            >
              Yassen Shopov
            </a>
            . All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground italic">
            Disclaimer: This is a fan-made project. Pokémon and all related
            properties are trademarks of Nintendo, Game Freak, and The Pokémon
            Company.
          </p>
        </div>
        <div className="flex space-x-6">
          <a
            href="https://github.com/yassenshopov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Github size={32} className="text-foreground" />
          </a>
          <a
            href="https://twitter.com/yassenshopov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Twitter size={32} className="text-foreground" />
          </a>
          <a
            href="https://www.linkedin.com/in/yassenshopov"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <Linkedin size={32} className="text-foreground" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
