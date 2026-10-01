import React from "react";
import logo from "../../assets/images/logo.png";

export default function Footer() {
  return (
    <div class="w-full bg-black text-white" id="contact">
      <footer class="py-3 my-4">
        <ul class="flex justify-center border-b border-gray-700 pb-3 mb-3">
          <li><a href="#" class="px-2 text-gray-500 hover:text-white">Home</a></li>
          <li><a href="#" class="px-2 text-gray-500 hover:text-white">Features</a></li>
          <li><a href="#" class="px-2 text-gray-500 hover:text-white">Pricing</a></li>
          <li><a href="#" class="px-2 text-gray-500 hover:text-white">FAQs</a></li>
          <li><a href="#" class="px-2 text-gray-500 hover:text-white">About</a></li>
        </ul>
        <p class="text-center text-gray-500">
          &copy; 2022 Company, Inc
        </p>
      </footer>
    </div>
  );
}
