import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html, body, #root {
  height: 100vh;
}
body {
  background-color: #e6e6e6;
}
.nav {
  background-color: #aacc11;
}
.title {
  margin: 0;
  padding: 20px;
}
`;

export const StyledDiv = styled.div`
text-align: center;
& > .spaced {
  margin-left: 10px;
  margin-right: 10px;
}
`;

export const StyledContentDiv = styled.div`
  margin: auto;
  width: 70vw;
  background-color: #111;
  text-align: center;
  min-height: 70vh;
  opacity: 90%;
`;

export const StyledAutosuggest = styled.div`
  display: inline;

  .react-autosuggest__container {
    position: relative;
    display: inline-block;
    height: 100%;
  }
  
  .react-autosuggest__input {
    width: 240px;
    height: 30px;
    padding: 10px 20px;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border: 1px solid #aaa;
    border-radius: 4px;
  }
  
  .react-autosuggest__input--focused {
    outline: none;
  }
  
  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  .react-autosuggest__suggestions-container {
    display: none;
  }
  
  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: 51px;
    width: 280px;
    border: 1px solid #aaa;
    background-color: #fff;
    font-family: Helvetica, sans-serif;
    font-weight: 300;
    font-size: 16px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    z-index: 2;
  }
  
  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 10px 20px;
  }
  
  .react-autosuggest__suggestion--highlighted {
    background-color: #ddd;
  }
`;
