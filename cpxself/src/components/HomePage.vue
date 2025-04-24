<script setup lang="ts">
</script>

<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title animate">
          <span class="greeting">你好，我是</span>
          <!-- <span class="name">崔朋鑫</span> -->
        </h1>
        <p class="hero-subtitle animate">
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx。xxxxxxxxxxxxxxxxxxxxxxxx，xxxxxxxxxxxxxxxxxxx。xxxxxxxxxxxxxxxxxxxxxxx，xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx。
        </p>
        <div class="social-links">
          <a href="https://github.com/yourusername" target="_blank" class="social-link animate">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" class="social-link animate">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
          <a href="mailto:your.email@example.com" class="social-link animate">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
            </svg>
            Email
          </a>
        </div>
      </div>
      <div class="hero-image animate">
        <img src="https://www.keaitupian.cn/cjpic/frombd/0/253/609210148/22216987.jpg" alt="崔朋鑫" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  flex-direction: column;
  position: relative;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 4px solid var(--primary-color);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  border-color: var(--accent-color);
}

.name {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.about-section {
  padding: 2rem;
  border-radius: 1rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.about-section h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
}

.about-section h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
  border-radius: 3px;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.hero-section {
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 4rem;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  position: relative;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.greeting {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--text-primary);
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  line-height: 1.8;
  font-weight: 400;
  max-width: 600px;
}

.social-links {
  display: flex;
  justify-content: space-around;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  font-weight: 500;
}

.social-link:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.hero-image {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: 2rem;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.hero-image::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(var(--primary-color-rgb), 0.2), 
    rgba(var(--accent-color-rgb), 0.2)
  );
  z-index: 1;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-image:hover img {
  transform: scale(1.05);
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 3rem;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    padding: 2rem;
    text-align: center;
  }

  .hero-content {
    order: 2;
  }

  .hero-image {
    order: 1;
    max-width: 400px;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1.5rem;
  }

  .social-links {
    flex-direction: column;
    align-items: stretch;
  }

  .social-link {
    justify-content: center;
  }

  .hero-image {
    max-width: 300px;
  }
}

.animate {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.hero-title {
  animation-delay: 0.2s;
}

.hero-subtitle {
  animation-delay: 0.4s;
}

.social-link:nth-child(1) {
  animation-delay: 0.6s;
}

.social-link:nth-child(2) {
  animation-delay: 0.7s;
}

.social-link:nth-child(3) {
  animation-delay: 0.8s;
}

.hero-image {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 