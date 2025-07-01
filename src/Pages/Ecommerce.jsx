import React from "react";
import { Typography, Box, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

const Ecommerce = () => {
  const products = [
    {
      id: 1,
      name: "Racing Helmet",
      price: "$299.99",
      image: "https://images.pexels.com/photos/163407/motorsport-racing-car-race-163407.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Sports Car Model",
      price: "$199.99",
      image: "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      rating: 4.6,
      reviews: 89,
    },
    {
      id: 3,
      name: "Racing Gloves",
      price: "$79.99",
      image: "https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Car Accessories",
      price: "$149.99",
      image: "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      rating: 4.5,
      reviews: 92,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, color: "#333" }}>
        E-commerce Store
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
        Discover our premium collection of racing equipment and accessories
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                  {product.name}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <StarIcon sx={{ color: "#ffa726", fontSize: 18 }} />
                  <Typography variant="body2" sx={{ ml: 0.5, color: "text.secondary" }}>
                    {product.rating} ({product.reviews} reviews)
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{ color: "#ff0000", fontWeight: "bold", mb: 2 }}
                >
                  {product.price}
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ShoppingCartIcon />}
                    sx={{
                      backgroundColor: "#ff0000",
                      "&:hover": { backgroundColor: "#cc0000" },
                      textTransform: "none",
                      flex: 1,
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "#ff0000",
                      color: "#ff0000",
                      "&:hover": {
                        borderColor: "#cc0000",
                        backgroundColor: "rgba(255,0,0,0.1)",
                      },
                    }}
                  >
                    <FavoriteIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#ff0000",
            color: "#ff0000",
            "&:hover": {
              borderColor: "#cc0000",
              backgroundColor: "rgba(255,0,0,0.1)",
            },
            textTransform: "none",
            px: 4,
          }}
        >
          View All Products
        </Button>
      </Box>
    </Box>
  );
};

export default Ecommerce;