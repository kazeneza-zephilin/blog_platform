const Footer = () => {
  return (
    <footer className="bg-orange-600 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} MyBlog. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-orange-200 transition text-sm">
            Privacy
          </a>
          <a href="#" className="hover:text-orange-200 transition text-sm">
            Terms
          </a>
          <a href="#" className="hover:text-orange-200 transition text-sm">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
