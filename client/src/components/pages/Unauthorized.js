import React from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";

const Unauthorized = () => {
  return (
    <StyledContainer className="text-center">
      <h3>PAGE NOT FOUND</h3>
      <StyledImage src="https://i.ibb.co/m6G622C/404.jpg" alt="404" />
    </StyledContainer>
  );
};

export default Unauthorized;

const StyledContainer = styled.div`
  height: 100vh;
  padding: 2rem;
`;

const StyledImage = styled.img`
  margin-top: 3rem;
  max-height: 80vh;
  min-height: 500px;
`;
