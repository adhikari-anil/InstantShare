const Loading = () => {
  return (
    <div className={`flex w-full items-center justify-center gap-5`}>
      <div className="h-[30px] w-[20px] bg-amber-950 animate-blink1 rounded"></div>
      <div className="h-[50px] w-[20px] bg-amber-950 animate-blink2 rounded"></div>
      <div className="h-[80px] w-[20px] bg-amber-950 animate-blink3 rounded"></div>
    </div>
  );
};

export default Loading;
