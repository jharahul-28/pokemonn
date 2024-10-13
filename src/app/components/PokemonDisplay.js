import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useOutsideClick } from "../hooks/UsesOutsideClick";

export function ExpandableCardDemo() {
  const [active, setActive] = useState(null);
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    async function fetchPokemon() {
      setLoading(true);
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon");
        setCards(response.data.results);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemon();
  }, []);

  useEffect(() => {
    async function fetchPokemonDetails(url) {
      try {
        const response = await axios.get(url);
        setActive({
          ...active,
          details: response.data,
        });
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      }
    }

    if (active && active.url) {
      fetchPokemonDetails(active.url);
    }
  }, [active]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-black w-full">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div
            className="w-screen flex flex-col justify-center items-center"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden w-fit max-w-[500px] pt-2">
              <motion.div
                className="flex flex-row justify-end"
              >
                <motion.button
                  key={`button-${active.name}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className="flex items-center justify-center bg-white rounded-full h-6 w-6"
                  onClick={() => setActive(null)}
                >
                  <motion.svg
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.05 } }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-black"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </motion.svg>
                </motion.button>
              </motion.div>
              <motion.div
                layoutId={`card-${active.name}-${id}`}
                ref={ref}
                className=""
              >
                <div className="flex justify-between items-start p-4 ">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.name}-${id}`}
                      className="font-bold text-neutral-700 dark:text-yellow-300 uppercase"
                    >
                      {active.name}
                    </motion.h3>
                    {active.details && (
                      <motion.p
                        layoutId={`details-${active.name}-${id}`}
                        className="text-neutral-800 dark:text-neutral-100 pt-2"
                      >
                        Height: {active.details.height} | Weight: {active.details.weight}
                      </motion.p>
                    )}
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-800 pb-6 capitalize flex flex-col items-start gap-4 overflow-auto dark:text-neutral-100"
                  >
                    {active.details && (
                      <p>Abilities: {active.details.abilities.map((ab) => ab.ability.name).join(", ")}</p>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Search Input */}
      <div className="max-w-2xl mx-auto w-full my-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-neutral-800 dark:text-white"
        />
      </div>

      {/* Show Loading Text or Filtered Cards */}
      {loading ? (
        <div className="max-w-2xl mx-auto text-center text-gray-600 dark:text-gray-400">Loading...</div>
      ) : (
        <ul className="max-w-2xl mx-auto w-full gap-4">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <motion.div
                layoutId={`card-${card.name}-${id}`}
                key={`card-${card.name}-${id}`}
                onClick={() => setActive(card)}
                className="p-4 flex flex-row justify-between items-center bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer mb-2"
              >
                <div className="flex gap-4 flex-col md:flex-row">
                  <motion.h3
                    layoutId={`title-${card.name}-${id}`}
                    className="font-medium text-neutral-800 dark:text-yellow-300 text-center md:text-left uppercase"
                  >
                    {card.name}
                  </motion.h3>
                </div>
                <motion.button
                  layoutId={`button-${card.name}-${id}`}
                  className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
                >
                  Details
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="max-w-2xl mx-auto text-center text-gray-600 dark:text-gray-400">
              No Pokémon found.
            </div>
          )}
        </ul>
      )}
    </div>
  );
}
