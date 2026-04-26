import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const services = [
    {
      icon: "fa-stethoscope",
      title: "Doctor Booking",
      description:
        "Connect with qualified doctors for consultations and health check-ups anytime.",
    },
    {
      icon: "fa-heart-pulse",
      title: "Nurse Services",
      description:
        "Professional nursing care and support right at your doorstep.",
    },
    {
      icon: "fa-users",
      title: "Companion Care",
      description:
        "Trained companions for emotional support and daily assistance.",
    },
    {
      icon: "fa-heartbeat",
      title: "Health Tracking",
      description:
        "Monitor vital signs and health metrics with our smart tracking system.",
    },
    {
      icon: "fa-pills",
      title: "Medicine Management",
      description: "Organize and track medications with timely reminders.",
    },
    {
      icon: "fa-gamepad",
      title: "Games & Activities",
      description:
        "Brain-engaging games and recreational activities for mental wellness.",
    },
  ];

  const features = [
    {
      icon: "fa-shield",
      title: "Secure & Private",
      description:
        "Your health data is encrypted and protected with the highest security standards.",
    },
    {
      icon: "fa-mobile",
      title: "Easy to Use",
      description:
        "Intuitive interface designed specifically for elderly users.",
    },
    {
      icon: "fa-clock",
      title: "24/7 Support",
      description:
        "Round-the-clock customer support for all your queries and emergencies.",
    },
    {
      icon: "fa-globe",
      title: "Community & Events",
      description:
        "Join yoga classes, wellness events, and connect with others.",
    },
  ];

  const testimonials = [
    {
      name: "Mrs. Sharma",
      role: "Elder Care User",
      text: "Vatsal has transformed my daily life. The doctor booking system is so easy to use, and the care I receive is exceptional.",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "Mr. Patel",
      role: "Family Member",
      text: "I can now monitor my father's health remotely and ensure he gets the best care possible. The medicine reminders have been a lifesaver.",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    {
      name: "Dr. Gupta",
      role: "Healthcare Provider",
      text: "Vatsal's platform makes it seamless to reach more patients and provide quality care efficiently.",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const faqs = [
    {
      question: "Who can use Vatsal?",
      answer:
        "Vatsal is designed for elderly individuals, their families, and healthcare providers. Anyone above 60 years can register as an elder user.",
    },
    {
      question: "How do I book a doctor?",
      answer:
        "Simply navigate to the Doctor Booking section, select your preferred doctor and time slot, and confirm your appointment. You'll receive a confirmation via SMS/Email.",
    },
    {
      question: "Is my health data secure?",
      answer:
        "Yes, all health data is encrypted using industry-standard protocols and stored securely. We comply with HIPAA and other healthcare data protection regulations.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, digital wallets (PayPal, Google Pay, Apple Pay), and bank transfers.",
    },
    {
      question: "Can family members help manage my profile?",
      answer:
        "Yes, you can add family members as caregivers who can help manage appointments, medicines, and health records with your permission.",
    },
    {
      question: "Do you provide emergency services?",
      answer:
        "Yes, we have an emergency button in the app that connects you directly to emergency services and your designated emergency contacts.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Healthcare Providers" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}`);
    setEmail("");
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Compassionate <span>Elder Care</span> at Your Fingertips
            </h1>
            <p className="hero-subtitle">
              Vatsal connects elderly individuals with trusted healthcare
              professionals, companions, and a supportive community for
              comprehensive wellness.
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/signup")}
              >
                Get Started <i className="fas fa-arrow-right ms-2"></i>
              </button>
              <button
                className="btn btn-outline-primary btn-lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <i className="fas fa-heart text-danger"></i>
              <span>95% Health</span>
            </div>
            <div className="floating-card card-2">
              <i className="fas fa-check-circle text-success"></i>
              <span>5 Bookings</span>
            </div>
            <div className="floating-card card-3">
              <i className="fas fa-smile text-warning"></i>
              <span>Happy Users</span>
            </div>
            <svg viewBox="0 0 500 500" className="hero-svg">
              <circle cx="250" cy="250" r="200" fill="#f0f3ff" />
              {/* <circle cx="250" cy="150" r="80" fill="#e8eeff" />
              <circle cx="350" cy="300" r="60" fill="#e8eeff" />
              <circle cx="150" cy="300" r="60" fill="#e8eeff" /> */}
              <image
                href="elder.png"
                x="100"
                y="100"
                width="300"
                height="300"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-4">
                <div className="stat-card">
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">
            Comprehensive care solutions designed for every aspect of elderly
            wellness
          </p>
          <div className="row">
            {services.map((service, index) => (
              <div key={index} className="col-md-4 col-sm-6 mb-4">
                <div className="service-card">
                  <div className="service-icon">
                    <i className={`fas ${service.icon}`}></i>
                  </div>
                  <h5 className="service-title">{service.title}</h5>
                  <p className="service-description">{service.description}</p>
                  {/* <a href="#" className="service-link">
                    Learn More <i className="fas fa-long-arrow-alt-right"></i>
                  </a> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="row align-items-center mt-5">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="steps">
                {[
                  {
                    num: "1",
                    title: "Create Account",
                    desc: "Sign up with your basic information",
                  },
                  {
                    num: "2",
                    title: "Complete Profile",
                    desc: "Add your health details and preferences",
                  },
                  {
                    num: "3",
                    title: "Browse & Book",
                    desc: "Find doctors, nurses, or companions",
                  },
                  {
                    num: "4",
                    title: "Get Care",
                    desc: "Receive quality healthcare and support",
                  },
                ].map((step, index) => (
                  <div key={index} className="step-item">
                    <div className="step-number">{step.num}</div>
                    <div>
                      <h6 className="step-title">{step.title}</h6>
                      <p className="step-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <div className="how-it-works-image">
                <svg viewBox="0 0 400 400" className="process-svg">
                  <rect
                    x="50"
                    y="50"
                    width="300"
                    height="300"
                    rx="20"
                    fill="#f0f3ff"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="80"
                    fill="#007bff"
                    opacity="0.1"
                  />
                  <path
                    d="M 200 140 L 260 200 L 200 260 L 140 200 Z"
                    fill="#007bff"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Vatsal?</h2>
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 mb-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <div className="feature-content">
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-desc">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4 col-sm-6 mb-4">
                <div className="testimonial-card">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div>
                      <p className="author-name">{testimonial.name}</p>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <i
                    className={`fas fa-chevron-down ${expandedFaq === index ? "expanded" : ""}`}
                  ></i>
                </div>
                {expandedFaq === index && (
                  <div className="faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <h3>Stay Updated</h3>
            <p>
              Subscribe to our newsletter for health tips and updates about new
              features.
            </p>
            <form onSubmit={handleNewsletterSignup}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience Better Elder Care?</h2>
          <p>
            Join thousands of families already using Vatsal for comprehensive
            elderly care.
          </p>
          <button
            className="btn btn-light btn-lg"
            onClick={() => navigate("/signup")}
          >
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
