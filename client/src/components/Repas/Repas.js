import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ADD } from "../../redux/actions/action"

export default function Repas() {
  const productsPerPage = 8;
  const [data, setData] = useState([]);
  const [produit, setProduit] = useState([]);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(produit.length / productsPerPage);
  const visibleProducts = produit.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleClick = (product) => {
    data.push(product);
    console.log(data);
  };
  useEffect(() => {
    localStorage.setItem("produit", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    try {
      getProduit();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getProduit = async () => {
    const get_produit = await axios.get(
      `${process.env.REACT_APP_API_URL}/manager/produit`
    );
    setProduit(get_produit.data.produit);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const Send = (e) => {
    // If the visitor is not logged in, send them to the login page
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(ADD(e))
  }


  return (
    <div className="bg-white">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {visibleProducts.map((p) => (
            <div key={p._id} className="bg-white border rounded-lg hover:shadow-md">
              <div className="w-full overflow-hidden bg-gray-200 rounded-lg">
                <img className="rounded-t-lg hover:opacity-75"
                  style={{ 'background-attachment': 'fixed', 'background-position': 'center', 'background-size': 'cover' }}
                  src={process.env.REACT_APP_API_URL + '/' + p.image}
                  alt={p.image}
                />
              </div>
              <div className="px-3 py-2">
                <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900">{p.title}</h5>
                <p className="flex gap-1 mb-1 font-normal text-gray-700 align-center">Price: <span className="font-bold">{p.price} DH</span></p>

                <p className="mb-1 text-sm text-gray-700">{p.description}</p>
              </div>
              <div className="flex justify-center my-2">
                <button type="button" onClick={() => Send(p)} className="px-10 py-2 text-center text-white rounded bg-amber-500">Add To Card</button>
              </div>
            </div>
          ))}
        </div>
        {pageCount > 1 && (
          <nav className="flex justify-center items-center gap-2 mt-8" aria-label="Pagination des produits">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
                className={`px-3 py-2 border rounded ${currentPage === page ? "bg-amber-500 text-white border-amber-500" : "bg-white"}`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => page + 1)}
              disabled={currentPage === pageCount}
              className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </nav>
        )}
      </div >
    </div >
  );
}