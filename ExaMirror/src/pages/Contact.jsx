import React, { useState, memo } from "react";
import Button from "../components/Button";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const directors = [
  {
    name: "Mr. Rishu Kumar",
    title: "Director",
    img: "./src/assets/images/Rishu.jpg",
    education: [
      "M.Sc. in (BIT Mesra, Ranchi)",
      "M.Tech in CS&IT (NU, New Delhi)",
      "Ph.D. in CSE (IIT Patna)",
    ],
    experience: "2+ year of Teaching Experience",
    email: "rishu.kumar@examirror.edu",
    linkedin: "#",
    facebook: "#",
    mail: "mailto:rishu.kumar@examirror.edu",
  },
  {
    name: "Mr. Saurabh Kumar",
    title: "Managing Director",
    img: "./src/assets/images/saurabh.jpg",
    education: [
      "M.Sc. in (MU Bodhgaya)",
      "M.Tech in CS&IT (NU, New Delhi)",
      "Ph.D. in CS (JNU New Delhi)",
    ],
    experience: "5+ year of Teaching Experience",
    email: "saurabh.kumar@examirror.edu",
    linkedin: "#",
    facebook: "#",
    mail: "mailto:saurabh.kumar@examirror.edu",
  },
];

const SocialIcons = memo(() => (
  <div className="flex gap-3 mt-2">
    <a
      href="#"
      aria-label="Instagram"
      className="text-gray-500 hover:text-pink-600"
    >
      <FaInstagram size={20} />
    </a>
    <a
      href="#"
      aria-label="Facebook"
      className="text-gray-500 hover:text-blue-600"
    >
      <FaFacebookF size={20} />
    </a>
    <a
      href="#"
      aria-label="YouTube"
      className="text-gray-500 hover:text-red-600"
    >
      <FaYoutube size={20} />
    </a>
    <a
      href="#"
      aria-label="LinkedIn"
      className="text-gray-500 hover:text-blue-800"
    >
      <FaLinkedinIn size={20} />
    </a>
  </div>
));

const ContactUsSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    exam: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="relative max-w-4xl mx-auto px-2 md:px-0 -mt-8">
      {/* Decorative SVGs */}
      <svg
        className="absolute -top-10 -left-10 w-40 h-40 text-blue-100 opacity-60 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M43.2,-74.6C56.7,-67.2,68.2,-56.2,74.2,-42.7C80.2,-29.2,80.7,-13.1,77.2,-0.2C73.7,12.7,66.2,25.4,58.2,37.2C50.2,49,41.7,59.9,30.2,66.7C18.7,73.5,4.3,76.2,-9.2,77.2C-22.7,78.2,-35.3,77.5,-46.2,71.1C-57.1,64.7,-66.3,52.7,-71.2,39.1C-76.1,25.5,-76.7,10.2,-74.2,-4.2C-71.7,-18.6,-66.1,-32.1,-57.2,-41.7C-48.3,-51.3,-36.1,-57.1,-23.1,-63.2C-10.1,-69.3,3.7,-75.7,18.2,-77.2C32.7,-78.7,47.3,-75.1,43.2,-74.6Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute -bottom-10 -right-10 w-40 h-40 text-purple-100 opacity-60 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M43.2,-74.6C56.7,-67.2,68.2,-56.2,74.2,-42.7C80.2,-29.2,80.7,-13.1,77.2,-0.2C73.7,12.7,66.2,25.4,58.2,37.2C50.2,49,41.7,59.9,30.2,66.7C18.7,73.5,4.3,76.2,-9.2,77.2C-22.7,78.2,-35.3,77.5,-46.2,71.1C-57.1,64.7,-66.3,52.7,-71.2,39.1C-76.1,25.5,-76.7,10.2,-74.2,-4.2C-71.7,-18.6,-66.1,-32.1,-57.2,-41.7C-48.3,-51.3,-36.1,-57.1,-23.1,-63.2C-10.1,-69.3,3.7,-75.7,18.2,-77.2C32.7,-78.7,47.3,-75.1,43.2,-74.6Z"
          transform="translate(100 100)"
        />
      </svg>

      {/* Main Card */}
      <div className="relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch gap-0 md:gap-0 overflow-hidden ">
          {/* Form */}
          <div className="flex-1 p-8 md:p-10 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              We usually respond within 24 hours.
            </p>
            <form
              className="space-y-4"
              onSubmit={handleSubmit}
              autoComplete="off"
              aria-label="Contact form"
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Name"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Email"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Phone"
              />
              <select
                name="exam"
                value={formData.exam}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
                aria-label="Select Exam"
              >
                <option value="">Select An Exam</option>
                <option value="nimcet">NIMCET</option>
                <option value="cuet-pg">CUET-PG</option>
                <option value="gate">GATE</option>
                <option value="stet">Bihar STET</option>
                <option value="other">Other</option>
              </select>
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Message"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full bg-blue-700 hover:bg-blue-800"
                aria-label="Submit"
              >
                {submitted ? "Submitted!" : "SUBMIT"}
              </Button>
              {submitted && (
                <div className="text-green-600 text-center mt-2 text-sm font-medium">
                  Thank you! Your message has been sent.
                </div>
              )}
            </form>
          </div>
          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-200"></div>
          {/* Contact Details */}
          <div className="flex-1 p-8 md:p-10 flex flex-col justify-center bg-white ">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Contact Details
            </h2>
            <div className="flex justify-center items-center mb-3">
              <FaEnvelope className="text-blue-600 mr-3" />
              <span className="text-gray-700 font-medium ">
                info@examirror.com
              </span>
            </div>
            <div className="flex justify-center items-center  mb-3">
              <FaPhoneAlt className="text-blue-600 mr-3" />
              <span className="text-gray-700 font-medium">+91 7004270294</span>
            </div>
            <div className="mt-3 flex flex-col justify-center items-center">
              <span className="block text-gray-500 text-sm mb-2">
                Connect With Us
              </span>
              <SocialIcons />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-0">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We'd love to hear from you. Reach out for any queries, feedback, or
          support.
        </p>
      </section>

      {/* Contact Card */}
      <ContactUsSection />

      {/* Directors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Meet Our Directors
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our experienced directors bring decades of expertise in education and
          competitive exam preparation
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {directors.map((director, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg flex flex-col items-center p-8"
            >
              <img
                src={director.img}
                alt={director.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
                loading="lazy"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {director.name}
              </h3>
              <p className="text-blue-700 font-medium mb-2">{director.title}</p>
              <div className="mb-2 w-full">
                <h4 className="font-semibold text-gray-700 text-sm mb-1">
                  Education
                </h4>
                <ul className="text-gray-600 text-sm list-disc list-inside">
                  {director.education.map((ed, i) => (
                    <li key={i}>{ed}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-2 w-full">
                <h4 className="font-semibold text-gray-700 text-sm mb-1">
                  Experience
                </h4>
                <p className="text-gray-600 text-sm">{director.experience}</p>
              </div>
              <div className="mb-2 w-full">
                <h4 className="font-semibold text-gray-700 text-sm mb-1">
                  Email
                </h4>
                <a
                  href={director.mail}
                  className="text-blue-600 text-sm hover:underline break-all"
                >
                  {director.email}
                </a>
              </div>
              <div className="flex gap-4 mt-2">
                <a
                  href={director.linkedin}
                  className="text-gray-500 hover:text-blue-600"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn size={20} />
                </a>
                <a
                  href={director.facebook}
                  className="text-gray-500 hover:text-blue-600"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={20} />
                </a>
                <a
                  href={director.mail}
                  className="text-gray-500 hover:text-blue-600"
                  aria-label="Email"
                >
                  <FaEnvelope size={20} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="bg-gray-900 py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="md:text-3xl text-sm font-bold text-white mb-6">
            "DON'T WAIT FOR THE OPPORTUNITY, CREATE IT"
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <Button variant="outline" className="text-white border-white">
              Profile
            </Button>
            <Button variant="primary" className="bg-blue-700">
              Courses
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
