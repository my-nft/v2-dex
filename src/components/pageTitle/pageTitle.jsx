const PageTitle = ({ title, subTitle }) => {
  return (
    <div className="pt-12 pb-8 mb-8 border-b border-gray-800 w-full   ">
      <h1 className="font-syneBold text-transparent text-5xl  bg-gradientBlue bg-clip-text sm:w-max max-w-full text-center mx-auto">
        {title}
      </h1>
      {subTitle && (
        <p className=" text-text text-center font-kanitLight text-xl  mt-6">
          {subTitle}
        </p>
      )}
    </div>
  );
};

export default PageTitle;
