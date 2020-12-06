import styled from "styled-components";
import { Link } from "react-router-dom";
import { Form as BSForm } from "react-bootstrap";

const Nav = styled.div`
  padding: 0 1rem;
  background-color: #4886af;
  justify-content: space-between;
`;

const Logo = styled.text`
  padding: 0.5rem 0;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.3rem;
  max-width: 40%;
  span {
    font-weight: 300;
  }
`;

const Menu = styled.div`
  padding: 0 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  @media (max-width: 768px) {
    overflow: hidden;
    flex-direction: column;
    max-height: ${({ isOpen }) => (isOpen ? "300px" : "0")};
    transition: max-height 0.3s ease-in;
    width: 100%;
  }
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  span {
    height: 2px;
    width: 25px;
    background: #ffffff;
    margin-bottom: 4px;
    border-radius: 5px;
  }
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MenuLink = styled(Link)`
  padding: 1rem 2rem;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.3s ease-in;
  font-size: 0.9rem;
  border: 5px solid transparent;
  &:hover {
    text-decoration: none;
    color: #073245;
    border-bottom: solid #073245;
  }
`;

const Column = styled.div`
  padding: 1rem;
  align-items: center;
`;

const Row = styled.div`
  padding: 1rem;
  align-items: flex-start;
  justify-content: space-around;
`;

const Card = styled.div`
  border: 0;
  background-color: #4886af;
  /* border: solid #4886af 2px;*/
  border-radius: 10px;
`;

const CardHeader = styled.div`
  background-color: #ffffff;
  color: #4886af;
  /* font-size: 1.5rem;
  font-weight: 400; */
`;

const CardBody = styled.div`
  padding: 1.3rem 1.3rem 0.8rem;
`;

const CardFooter = styled.div`
  background-color: #4886af;
  text-align: end;
  padding: 0 1.3rem 0.3rem;
`;

const CardTitle = styled.h5`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 400;
`;

const LoginButton = styled.button`
  width: 100%;
  background-color: #ffffff;
  border: none;
  color: #83c1e8;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  outline: none;
  &:hover {
    background-color: #83c1e8;
    color: #ffffff;
  }
`;

const Form = styled.form`
  flex: auto;
  flex-direction: column;
  justify-content: space-around;
`;

const FormGroup = styled.div`
  padding: 0.5rem 0.3rem;
`;

const Input = styled.input`
  width: 15rem;
  border: none;
  border-bottom: 2px solid #83c1e8;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border-bottom: 2px solid #4886af;
  }
`;

const Image = styled.img`
  max-width: 50%;
  min-width: 50%;
  /* border: 2px solid #83c1e8; */
  @media (max-width: 768px) {
    min-min-width: 80%;
  }
`;

const Text = styled.p`
  color: #ffffff;
  font-size: 0.9rem;
  padding: 0.5rem 0.8rem;

  a {
    color: #ffffff;
    text-decoration: underline;
    font-weight: 500;
    &:hover {
      color: #83c1e8;
    }
  }
`;

const PrimaryButton = styled.button`
  background-color: #4886af;
  border: none;
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  outline: none;
  &:hover {
    background-color: #83c1e8;
  }
`;

const SecondaryButton = styled.button`
  background-color: #424246;
  border: none;
  color: #ffffff;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 15px;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  outline: none;
  &:hover {
    background-color: #83c1e8;
  }
`;

const StyledTextArea = styled(BSForm.Control)`
  min-width: 100%;
  resize: none;
  border: 2px solid #83c1e8;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:focus {
    outline: none;
    border: 2px solid #4886af;
  }
`;

const StyledLabel = styled(BSForm.Label)`
  color: #4886af;
  font-size: 0.9rem;
`;

export {
  StyledTextArea,
  StyledLabel,
  Text,
  Image,
  Input,
  Form,
  FormGroup,
  Column,
  Row,
  LoginButton,
  CardBody,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Nav,
  Logo,
  Hamburger,
  Menu,
  MenuLink,
  PrimaryButton,
  SecondaryButton,
};
