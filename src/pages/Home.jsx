import React from 'react';
import { Link } from "react-router-dom";

import heroImage from "../assets/images/hero.jpg";
import girlsImage from "../assets/images/girls.jpg";
import boysImage from "../assets/images/boys.jpg";
import kidsImage from "../assets/images/kids.jpg";
import aboutImage from "../assets/images/about.jpg";

function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#3E2617]">

      <section
        className="relative min-h-[650px] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})`}}>
        
        <div className="absolute inset-0 bg-[#f8f4ee]/30"></div>
        
        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-8 sm:px-12 lg:px-16">

          <div className="max-w-xl">

            <p className="mb-5 text-sm font-medium tracking-[0.3em] text-[#5a351f]">
              NEW COLLECTION
            </p>

            <h1 className="font-serif text-5xl font-normal leading-[1.05] text-[#3d2415] sm:text-6xl lg:text-7xl">
              Little styles,
              <br />
              big smiles.
            </h1>

            <p className="mt-7 max-w-md text-base leading-7 text-[#5f4a3b] sm:text-lg">
              Discover beautiful, comfortable and
              adorable outfits made especially for
              your little ones.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-block bg-[#6b3f22] px-8 py-4 text-sm font-medium tracking-wide !text-white transition duration-300 hover:bg-[#4d2c19]"
            >
              SHOP NOW
            </Link>

          </div>

        </div>
      </section>
      

      <section className="bg-[#F5F0E8] px-6 py-20 sm:px-10 lg:px-16">

        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-normal sm:text-5xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-sm text-[#765e4e] sm:text-base">
            Find the perfect style for every little one.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3">

          <Link
            to="/products?category=Girls"
            className="group overflow-hidden bg-[#EDE4D8]">

            <div className="h-[420px] overflow-hidden">

              <img src={girlsImage} alt="Girls collection" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>

            </div>

            <div className="flex items-center justify-between px-6 py-6">

              <div>
                <h3 className="font-serif text-2xl">
                  Girls
                </h3>

                <p className="mt-1 text-sm text-[#765e4e]">
                  Explore Collection →
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/products?category=Boys"
            className="group overflow-hidden bg-[#EDE4D8]">
            <div className="h-[420px] overflow-hidden">

              <img src={boysImage} alt="Boys collection" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
            </div>

            <div className="flex items-center justify-between px-6 py-6">

              <div>
                <h3 className="font-serif text-2xl">
                  Boys
                </h3>

                <p className="mt-1 text-sm text-[#765e4e]">
                  Explore Collection →
                </p>
              </div>
            </div>
          </Link>


          <Link
            to="/products?category=Kids"
            className="group overflow-hidden bg-[#EDE4D8]">

            <div className="h-[420px] overflow-hidden">

              <img
                src={kidsImage}
                alt="Kids collection"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

            </div>

            <div className="flex items-center justify-between px-6 py-6">

              <div>
                <h3 className="font-serif text-2xl">
                  Kids
                </h3>

                <p className="mt-1 text-sm text-[#765e4e]">
                  Explore Collection →
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>


    


      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[#E8DDD0] px-8 py-12 sm:px-12 lg:px-16">

          <p className="mb-3 text-xs tracking-[0.25em] text-[#765039]">
            About Us
          </p>

          <h2 className="font-serif text-4xl font-normal sm:text-5xl">
            Made for little
            <br />
            moments.
          </h2>

          <p className="mt-5 max-w-lg leading-7 text-[#5f4b3d]">
            We believe childhood should be filled with comfort,
            happiness and beautiful little moments.
          </p>

          <p className="mt-3 max-w-lg leading-7 text-[#5f4b3d]">
            Our collection is thoughtfully selected with
            soft fabrics, timeless designs and playful details
            made for everyday adventures.
          </p>

          <Link
            to="/products"
            className="mt-6 w-fit border border-[#6b3f22] px-7 py-3 text-sm font-medium tracking-wide text-[#6b3f22] transition hover:bg-[#6b3f22] hover:!text-white"
          >
            EXPLORE COLLECTION →
          </Link>

        </div>

        <div className="h-[400px] lg:h-[460px]">

          <img
            src={aboutImage}
            alt="Kidswear lifestyle"
            className="h-full w-full object-cover"
          />

        </div>

      </section>

      
{/* Why Shop with Inarah */}
<section className="bg-[#F5F0E8] px-6 py-20 sm:px-10 lg:px-16">

  <div className="mx-auto max-w-7xl">

    {/* Section Heading */}
    <div className="mb-14 text-center">

      <p className="mb-4 text-xs font-medium tracking-[0.3em] text-[#765039]">
        THE INARAH EXPERIENCE
      </p>

      <h2 className="font-serif text-4xl font-normal text-[#3E2617] sm:text-5xl">
        Why Shop with Inarah?
      </h2>

      <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#765e4e] sm:text-base">
        Because little ones deserve a little extra love.
        Discover thoughtfully selected styles that make
        every childhood moment even more special.
      </p>

    </div>

    {/* Benefit Cards */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {/* Card 1 */}
      <div className="group border border-[#E5D8C9] bg-[#FAF7F2] px-7 py-10 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE2D5] text-3xl text-[#6b3f22]">
          ♡
        </div>

        <h3 className="font-serif text-xl text-[#3E2617]">
          Comfort Comes First
        </h3>

        <p className="mt-4 text-sm leading-7 text-[#765e4e]">
          Thoughtfully selected styles that keep your
          little ones comfortable throughout the day.
        </p>

      </div>

      {/* Card 2 */}
      <div className="group border border-[#E5D8C9] bg-[#FAF7F2] px-7 py-10 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE2D5] text-3xl text-[#6b3f22]">
          ✿
        </div>

        <h3 className="font-serif text-xl text-[#3E2617]">
          Styles for Every Moment
        </h3>

        <p className="mt-4 text-sm leading-7 text-[#765e4e]">
          From everyday adventures to special celebrations,
          find lovely outfits for every occasion.
        </p>

      </div>

      {/* Card 3 */}
      <div className="group border border-[#E5D8C9] bg-[#FAF7F2] px-7 py-10 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE2D5] text-3xl text-[#6b3f22]">
          ✨
        </div>

        <h3 className="font-serif text-xl text-[#3E2617]">
          Little Details, Big Love
        </h3>

        <p className="mt-4 text-sm leading-7 text-[#765e4e]">
          Charming designs and playful details that
          celebrate the joy of childhood.
        </p>

      </div>

      {/* Card 4 */}
      <div className="group border border-[#E5D8C9] bg-[#FAF7F2] px-7 py-10 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE2D5] text-3xl text-[#6b3f22]">
          ♡
        </div>

        <h3 className="font-serif text-xl text-[#3E2617]">
          Shopping Made Lovely
        </h3>

        <p className="mt-4 text-sm leading-7 text-[#765e4e]">
          Explore our collections and find your
          little one's next favourite outfit with ease.
        </p>

      </div>

    </div>

  </div>

</section>


      
    </div>
  );
}

export default Home;