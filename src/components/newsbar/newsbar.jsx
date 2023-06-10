const NewsBar = ({ message, link }) => {
  return (
    <>
      {link ? (
        <a
          href={link}
          className="absolute top-0 left-0 w-full py-1 h-[38px] z-[1000] bg-gradientNews max-w-[100vw] overflow-hidden whitespace-nowrap"
        >
          <div>
            <span className="text-base font-kanitLight text-white animate-slide block leading-[28px] ">
              {message}
            </span>
          </div>
        </a>
      ) : (
        <div className="absolute top-0 left-0 w-full py-1 h-[38px] z-[1000] bg-gradientNews max-w-[100vw] overflow-hidden whitespace-nowrap">
          <div>
            <span className="text-base font-kanitLight text-white animate-slide block leading-[28px] ">
              {message}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsBar;
