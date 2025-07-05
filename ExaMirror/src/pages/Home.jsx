import React from 'react';
import Button from '../components/Button';
import { FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Amit Kumar',
    exam: 'CUET Aspirant',
    quote: 'The video lectures and study materials are excellent. I was able to clear my exam with flying colors!'
  },
  {
    name: 'Priya Sharma',
    exam: 'NIMCET Aspirant',
    quote: 'The structured course content and practice materials helped me understand complex topics easily.'
  },
  {
    name: 'Rahul Verma',
    exam: 'UGC-NET Aspirant',
    quote: 'The expert guidance and comprehensive study materials made all the difference in my preparation.'
  }
];

const SocialIcons = () => (
  <div className="flex gap-5 justify-center mt-2">
    <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-600"><FaInstagram size={22} /></a>
    <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-blue-600"><FaFacebookF size={22} /></a>
    <a href="#" aria-label="YouTube" className="text-gray-500 hover:text-red-600"><FaYoutube size={22} /></a>
    <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-800"><FaLinkedinIn size={22} /></a>
  </div>
);

const Home = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto  px-5 md:px-0 mt-8 mb-24">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center p-8 gap-8 relative overflow-hidden">
          {/* Left: Headline and Buttons */}
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Ace Your Competitive Exams<br className="hidden md:block" /> with <span className="text-blue-700">Expert-Led Learning!</span>
            </h1>
            <p className="text-gray-600 text-lg mb-6 max-w-lg mx-auto md:mx-0">
              Your ultimate destination for top-notch online learning in Computer Science and beyond. Whether you're preparing for NET, GATE, CUET-PG, CUET-UG, NIMCET, STET, TGT / PGT, or other competitive exams, we've got you covered!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">Explore Courses</Button>
            </div>
          </div>
          {/* Right: Feature Cards */}
          <div className="flex-1 flex flex-col sm:flex-row gap-6 justify-center items-center z-10">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-md p-4 flex flex-col items-center w-44 h-52 relative">
              <span className="absolute -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full opacity-40"></span>
              <img src="\src\assets\images\two.jpg" alt="Examirror Study Material" className=" border-spacing-1 rounded-md " />
              {/* <div className="text-blue-700 font-bold text-lg mb-1">EXAMIRROR</div>
              <div className="text-xs text-gray-700 text-center">LIVE CLASSES<br />STUDY MATERIAL</div> */}
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl shadow-md p-4 flex flex-col items-center w-44 h-52 relative">
              <span className="absolute -bottom-4 -right-4 w-8 h-8 bg-purple-200 rounded-full opacity-40"></span>
              <img src="\src\assets\images\one.jpg" alt="Exambook Test Series" className="border-spacing-2 rounded-md" />
              {/* <div className="text-purple-700 font-bold text-lg mb-1">EXAMBOOK</div>
              <div className="text-xs text-gray-700 text-center">TEST SERIES</div> */}
            </div>
          </div>
          {/* Decorative SVGs */}
          <svg className="absolute -top-10 -left-10 w-40 h-40 text-blue-100 opacity-60 pointer-events-none z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M43.2,-74.6C56.7,-67.2,68.2,-56.2,74.2,-42.7C80.2,-29.2,80.7,-13.1,77.2,-0.2C73.7,12.7,66.2,25.4,58.2,37.2C50.2,49,41.7,59.9,30.2,66.7C18.7,73.5,4.3,76.2,-9.2,77.2C-22.7,78.2,-35.3,77.5,-46.2,71.1C-57.1,64.7,-66.3,52.7,-71.2,39.1C-76.1,25.5,-76.7,10.2,-74.2,-4.2C-71.7,-18.6,-66.1,-32.1,-57.2,-41.7C-48.3,-51.3,-36.1,-57.1,-23.1,-63.2C-10.1,-69.3,3.7,-75.7,18.2,-77.2C32.7,-78.7,47.3,-75.1,43.2,-74.6Z" transform="translate(100 100)" /></svg>
          <svg className="absolute -bottom-10 -right-10 w-40 h-40 text-purple-100 opacity-60 pointer-events-none z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M43.2,-74.6C56.7,-67.2,68.2,-56.2,74.2,-42.7C80.2,-29.2,80.7,-13.1,77.2,-0.2C73.7,12.7,66.2,25.4,58.2,37.2C50.2,49,41.7,59.9,30.2,66.7C18.7,73.5,4.3,76.2,-9.2,77.2C-22.7,78.2,-35.3,77.5,-46.2,71.1C-57.1,64.7,-66.3,52.7,-71.2,39.1C-76.1,25.5,-76.7,10.2,-74.2,-4.2C-71.7,-18.6,-66.1,-32.1,-57.2,-41.7C-48.3,-51.3,-36.1,-57.1,-23.1,-63.2C-10.1,-69.3,3.7,-75.7,18.2,-77.2C32.7,-78.7,47.3,-75.1,43.2,-74.6Z" transform="translate(100 100)" /></svg>
        </div>
      </section>

      {/* Why Choose Us / About Us Section */}
      <section className="max-w-6xl mx-auto px-5 md:px-0 flex flex-col md:flex-row gap-8 mb-16">
        {/* Left: Why Choose Us */}
        <div className="flex-2 flex flex-col items-center md:items-start md:ml-24 ">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-8 w-full max-w-xs mb-6">
            <div className="text-blue-700 font-bold text-lg mb-2">EXAMIRROR</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">WHY CHOOSE <span className="text-blue-700">US</span></h2>
            <ul className="space-y-3">
              <li className="bg-white rounded-lg px-4 py-2 shadow text-blue-700 font-semibold">Daily Live Classes</li>
              <li className="bg-white rounded-lg px-4 py-2 shadow text-blue-700 font-semibold">Chapter-wise Mock Test</li>
              <li className="bg-white rounded-lg px-4 py-2 shadow text-blue-700 font-semibold">Doubt Sessions</li>
            </ul>
          </div>
        </div>
        {/* Right: About Us */}
        <div className="flex-1 flex flex-col justify-center px-5">
          <div className="mb-2 text-blue-700 font-bold uppercase tracking-widest text-sm">About Us</div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Join us today and take a step closer to achieving your <span className="text-blue-700">academic and career goals!</span></h3>
          <p className="text-gray-700 text-base mb-2">
            At <span className="font-bold text-blue-700">EXAMIRROR</span>, we are committed to empowering students and aspirants with structured and effective learning resources to help them excel in competitive exams and build a successful career. Whether you are a beginner or an advanced learner, our platform provides the right guidance to understand complex concepts, practice effectively, and boost your confidence for success.
          </p>
          <p className="text-gray-700 text-base">
            With expertly curated content and personalized counseling services, we not only prepare you for exams like NET, GATE, CUET-PG, NIMCET, STET, TGT / PGT, and many more, but also guide you toward the best career choices.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-5xl mx-auto px-5 md:px-0 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg mb-2">
                {t.name.charAt(0)}
              </div>
              <div className="font-semibold text-gray-900 mb-1">{t.name}</div>
              <div className="text-xs text-gray-500 mb-2">{t.exam}</div>
              <div className="text-gray-700 text-sm">"{t.quote}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect With Us Section */}
      <section className="max-w-5xl mx-auto px-5 md:px-0 mb-12">
        <div className="bg-white rounded-xl shadow flex flex-col items-center py-8">
          <div className="text-gray-700 font-semibold mb-2">Connect With Us</div>
          <SocialIcons />
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="bg-gray-900 py-16 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm md:text-3xl font-bold text-white mb-6">"DON'T WAIT FOR THE OPPORTUNITY, CREATE IT"</h2>
          <div className="flex flex-col sm:flex-row justify-center px-12 gap-4  mt-4">
            <Button variant="outline" className="text-white border-white">Profile</Button>
            <Button variant="primary" className="bg-blue-700">Courses</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home; 