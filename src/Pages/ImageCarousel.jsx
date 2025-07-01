// src/Pages/ImageCarousel.jsx
import React from "react";
import { Box } from "@mui/material";
import helmet from "../Assets/helmet.png";
import jacket from "../Assets/jacket.png";
import gloves from "../Assets/gloves.png";
import tires from "../Assets/tires.png";
import wheel from "../Assets/wheel.png";
import clothes from "../Assets/clothes.png";

const moviePosters = [
  { image: helmet, title: "Helmet" },
  { image: jacket, title: "Jacket" },
  { image: gloves, title: "Gloves" },
  { image: tires, title: "Tires" },
  { image: wheel, title: "Wheel" },
  { image: clothes, title: "Clothes" },
];

const handlePosterClick = (movie) => {
  alert(`You clicked on ${movie.title}`);
};

const ImageCarousel = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%", // Matches Ecommerce's flexible width within the layout
          height: { xs: "120px", md: "150px" },
          overflow: "hidden",
          px: 3, // Matches Ecommerce's padding for consistency
          py: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "max-content", // Allows content to size naturally
            animation: `scroll 40s linear infinite`,
            "@keyframes scroll": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: `translateX(-${100 / moviePosters.length}%)` }, // Adjusted to move based on item width
            },
          }}
        >
          {[...moviePosters, ...moviePosters].map((movie, idx) => (
            <Box
              key={idx}
              onClick={() => handlePosterClick(movie)}
              sx={{
                width: { xs: "160px", md: "200px" },
                height: { xs: "100px", md: "130px" },
                mx: 1,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  zIndex: 2,
                },
              }}
            >
              <Box
                component="img"
                src={movie.image}
                alt={movie.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default ImageCarousel;