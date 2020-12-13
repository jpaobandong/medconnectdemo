import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterContainer class="site-footer">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 col-md-8">
            <h6>About</h6>
            <p class="text-justify">
              MedConnect is a web based medical records system that provides
              access and connection between medical practitioners and potential
              users. The developers aim to fill in the gaps of paper based
              system by providing a more reliable, user-friendly, and secured
              portal. It's features include record management, appointment
              setter, user login and registration. MedConnect is a modular
              system which means it is highly customizable according to the
              requirements and desired features of the clients.
            </p>
          </div>

          <div /* class="col-xs-6 col-md-3" */>
            <h6>Reach Us</h6>
            <p>
              Email: <b>medconnect.head@gmail.com</b> <br />
              Phone: <b>+639012345678</b>
            </p>
          </div>

          {/*
          <div class="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul class="footer-links">
              <li>
                <a href="http://scanfcode.com/about/">About Us</a>
              </li>
              <li>
                <a href="http://scanfcode.com/contact/">Contact Us</a>
              </li>
              <li>
                <a href="http://scanfcode.com/contribute-at-scanfcode/">
                  Contribute
                </a>
              </li>
              <li>
                <a href="http://scanfcode.com/privacy-policy/">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="http://scanfcode.com/sitemap/">Sitemap</a>
              </li>
            </ul>
          </div> */}
        </div>
        <hr />
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-6 col-xs-12">
            <p class="copyright-text">
              Copyright &copy; 2020 All Rights Reserved by MedConnect.
            </p>
          </div>
          {/* <div class="col-md-4 col-sm-6 col-xs-12">
            <ul class="social-icons">
              <li>
                <a class="facebook" href="#">
                  <i class="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a class="twitter" href="#">
                  <i class="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a class="dribbble" href="#">
                  <i class="fa fa-dribbble"></i>
                </a>
              </li>
              <li>
                <a class="linkedin" href="#">
                  <i class="fa fa-linkedin"></i>
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  padding-top: 1.3rem;
  background-color: #b8cee5;
  font-size: 0.8rem;
`;
