<a id="readme-top"></a>
[![license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT header -->
<br />
<div align="center">

  <h3 align="center">Matgeneratorn</h3>

  <p align="center">
    A food recipe generator!
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Matgeneratorn is a simple web app built because my wife wished for an easy way to get recipe suggestions with ingredients and instructions. It generates a weekly meal plan with 7 recipe "cards" and allows filtering recipes by categories, i.e. different proteins or vegetarian only.
Recipes are fetched using an API from Arla.se, and all links point back to their site for full details. As of today the app is only available in Swedish.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This project was built with the following tech stack.

[![JavaScript][JavaScript]][JavaScript-url]
[![HTML5][HTML5]][HTML5-url]
[![CSS3][CSS3]][CSS3-url]
[![Node.js][Node.js]][Node.js-url]
[![Express.js][Express.js]][Express-url]
[![Tailwind CSS][Tailwind CSS]][TailwindCSS-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Docker](https://www.docker.com/get-started)
* [Docker Compose](https://docs.docker.com/compose/)

### Installation & Setup

Clone the repository

Using HTTPS:
```
git clone https://github.com/lambergmiki/matgeneratorn.git
cd  matgeneratorn
```

Using SSH:
```
git clone git@github.com:lambergmiki/matgeneratorn.git
cd matgeneratorn
```
---


Then start the development environment with Docker Compose:
```
docker compose -f compose.dev.yaml up --build -d
```
---

By default the app will be available at: http://localhost:5005


<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Add README
- [ ] Filter to exclude desserts
- [ ] Save x recipes and generate new recipes for remaining ones
- [ ] Ability to generate recipes from multiple categories
- [ ] Improve algorithm to reduce response times for the recipe generator


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

You are welcome to contact me by email or LinkedIn!

[lamberg.miki@gmail.com](mailto:lamberg.miki@gmail.com)  
[LinkedIn](https://www.linkedin.com/in/lambergmiki)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Huge thanks to Andreas Eriksson for fantastic help with deploying my app privately, outside the servers supplied by our University.

* [README template by othneildrew](https://github.com/othneildrew)
* [Choose an Open Source License](https://choosealicense.com)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[license-shield]: https://img.shields.io/badge/MIT-green?style=for-the-badge
[license-url]: https://github.com/lambergmiki/matgeneratorn/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/lambergmiki
[JavaScript]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[HTML5]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5
[CSS3]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node.js-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
