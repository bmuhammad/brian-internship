import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NFTExpiration from "../home/NFTExpiration";

const ExploreItems = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [loading, setLoading] = useState();
  const [visibleItems, setVisibleItems] = useState(8);
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data } = await axios.get(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${value}`
      );

      setExploreItems(data);
      setLoading(false);
    };

    fetchData();
  }, [value]);

  const handleFilterChange = (event) => {
    setValue(event.target.value);
  };

  const handleShowMore = () => {
    setVisibleItems(visibleItems + 4);
  };

  return (
    <>
      <div>
        <select id="filter-items" defaultValue="" onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {loading ? (
        <>
          {new Array(8).fill(0).map((_, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div id="exploreSkeleton" className="nft__item">
                <div className="author_list_pp"></div>
                <div></div>

                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {exploreItems.slice(0, visibleItems).map((exploreItem) => (
            <div
              key={exploreItem.id}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                   to={{ pathname: `/author/${exploreItem.authorId}`, state: exploreItem.authorId}}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                  >
                    <img
                      className="lazy"
                      src={exploreItem.authorImage}
                      alt=""
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                {exploreItem.expiryDate != null ? (
                  <div className="de_countdown">
                    {" "}
                    <NFTExpiration nftObject={exploreItem} />
                  </div>
                ) : (
                  <></>
                )}
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to={{ pathname: `/item-details/${exploreItem.nftId}`, state: exploreItem.nftId}}>
                    <img
                      src={exploreItem.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>{exploreItem.title}</h4>
                  </Link>
                  <div className="nft__item_price">{exploreItem.price}</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{exploreItem.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      {visibleItems < exploreItems.length && (
        <div className="col-md-12 text-center">
          <Link
            to=""
            id="loadmore"
            className="btn-main lead"
            onClick={handleShowMore}
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
