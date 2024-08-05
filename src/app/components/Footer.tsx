import React from "react"
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  TV Shows
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  New Releases
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  My List
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-xl font-bold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-gray-300">
                <FaFacebookF />
              </a>
              <a href="#" className="text-2xl hover:text-gray-300">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl hover:text-gray-300">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl hover:text-gray-300">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="mb-4">
              Subscribe to our newsletter for updates on new releases and
              promotions.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none flex-grow"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center">
          <p>
            &copy; {new Date().getFullYear()} MovieMania. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
