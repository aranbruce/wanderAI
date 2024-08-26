interface LogoProps {
  height?: number;
  width?: number;
}

export default function Logo({ height = 32, width = 156 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 156 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.6853 3.16223C18.6853 1.32926 16.4249 0.461861 15.1987 1.8243L2.57837 15.8469C1.42003 17.134 2.33342 19.1849 4.06496 19.1849H12.315V28.8371C12.315 30.67 14.5754 31.5374 15.8015 30.175L28.4219 16.1524C29.5803 14.8653 28.6669 12.8144 26.9353 12.8144H18.6853V3.16223ZM18.6853 12.8144H12.315V19.1849H14.6853C16.8945 19.1849 18.6853 17.394 18.6853 15.1849V12.8144Z"
        fill="currentColor"
      />
      <path
        d="M39.21 23L35.8733 5.98999H40.4L42.08 17.0267L42.36 18.94H42.5467L45.1133 5.98999H49.8733L52.44 18.94H52.65L52.86 17.33L54.54 5.98999H59.09L55.8 23H49.8267L47.8433 13.3167L47.5867 11.8933H47.4233L47.1667 13.3167L45.16 23H39.21ZM64.8067 23.2333C63.6711 23.2333 62.7456 22.9767 62.03 22.4633C61.33 21.95 60.8167 21.2267 60.49 20.2933C60.1633 19.3444 60 18.2478 60 17.0033V16.3967C60 14.1722 60.4356 12.5778 61.3067 11.6133C62.1778 10.6333 63.3445 10.1433 64.8067 10.1433C65.6 10.1433 66.3156 10.3144 66.9534 10.6567C67.6067 10.9833 68.0889 11.4655 68.4 12.1033H68.5867L68.7967 10.3533H72.6934V23H68.5867V21.2733H68.4C68.0889 21.8956 67.6067 22.3778 66.9534 22.72C66.3156 23.0622 65.6 23.2333 64.8067 23.2333ZM66.4867 19.8967C67.1245 19.8967 67.63 19.71 68.0034 19.3367C68.3767 18.9633 68.5634 18.4189 68.5634 17.7033V15.65C68.5634 14.95 68.3767 14.4133 68.0034 14.04C67.63 13.6511 67.1245 13.4567 66.4867 13.4567C65.8178 13.4567 65.2967 13.6511 64.9234 14.04C64.5656 14.4289 64.3867 14.9656 64.3867 15.65V17.75C64.3867 18.4189 64.5656 18.9478 64.9234 19.3367C65.2967 19.71 65.8178 19.8967 66.4867 19.8967ZM76.0473 23V10.3533H79.8973L80.1773 12.29H80.4107C80.6751 11.6522 81.1185 11.1311 81.7407 10.7267C82.3785 10.3222 83.1329 10.12 84.004 10.12C85.3418 10.12 86.4073 10.5244 87.2007 11.3333C87.994 12.1422 88.3907 13.4567 88.3907 15.2767V23H84.2607V15.8133C84.2607 14.9111 84.0818 14.2967 83.724 13.97C83.3818 13.6278 82.9073 13.4567 82.3007 13.4567C81.5851 13.4567 81.0485 13.69 80.6907 14.1567C80.3485 14.6233 80.1773 15.2456 80.1773 16.0233V23H76.0473ZM95.7042 23.2333C94.5687 23.2333 93.6431 22.9767 92.9276 22.4633C92.2276 21.9344 91.7142 21.2033 91.3876 20.27C91.0609 19.3367 90.8976 18.24 90.8976 16.98V16.3733C90.8976 14.1489 91.3331 12.5544 92.2042 11.59C93.0753 10.61 94.242 10.12 95.7042 10.12C96.4976 10.12 97.2131 10.2911 97.8509 10.6333C98.5042 10.9755 98.9865 11.4655 99.2976 12.1033H99.4842V5.98999H103.614V23H99.6942L99.4842 21.2733H99.2976C98.9865 21.8956 98.5042 22.3778 97.8509 22.72C97.2131 23.0622 96.4976 23.2333 95.7042 23.2333ZM97.3842 19.8967C98.022 19.8967 98.5276 19.71 98.9009 19.3367C99.2742 18.9633 99.4609 18.4189 99.4609 17.7033V15.65C99.4609 14.95 99.2742 14.4133 98.9009 14.04C98.5276 13.6511 98.022 13.4567 97.3842 13.4567C96.7153 13.4567 96.1942 13.6511 95.8209 14.04C95.4631 14.4289 95.2842 14.9656 95.2842 15.65V17.7267C95.2842 18.3956 95.4631 18.9244 95.8209 19.3133C96.1942 19.7022 96.7153 19.8967 97.3842 19.8967ZM112.614 23.2333C111.199 23.2333 110.017 22.9689 109.068 22.44C108.119 21.8956 107.403 21.1333 106.921 20.1533C106.454 19.1733 106.221 18.0378 106.221 16.7467V16.49C106.221 15.1211 106.478 13.97 106.991 13.0367C107.504 12.0878 108.212 11.3644 109.114 10.8667C110.032 10.3689 111.082 10.12 112.264 10.12C113.587 10.12 114.707 10.3689 115.624 10.8667C116.558 11.3489 117.265 12.0333 117.748 12.92C118.23 13.7911 118.471 14.8178 118.471 16V17.7267H110.398V18.31C110.398 18.8389 110.592 19.2744 110.981 19.6167C111.37 19.9589 111.868 20.13 112.474 20.13C113.019 20.13 113.462 20.0211 113.804 19.8033C114.147 19.57 114.349 19.2667 114.411 18.8933H118.331C118.284 19.7489 118.012 20.5033 117.514 21.1567C117.017 21.81 116.348 22.3233 115.508 22.6967C114.668 23.0544 113.703 23.2333 112.614 23.2333ZM110.398 15.1133V15.23H114.411V15.1133C114.411 14.4444 114.224 13.9544 113.851 13.6433C113.478 13.3167 112.995 13.1533 112.404 13.1533C111.813 13.1533 111.331 13.3244 110.958 13.6667C110.584 13.9933 110.398 14.4756 110.398 15.1133ZM121.083 23V13.4567C121.083 12.5233 121.363 11.7767 121.923 11.2167C122.499 10.6411 123.246 10.3533 124.163 10.3533H129.297V13.6667H125.213V23H121.083ZM130.016 23L135.569 5.98999H141.682L147.259 23H142.896L141.916 19.8733H135.219L134.239 23H130.016ZM136.246 16.56H140.889L139.372 11.7067L138.649 9.37332H138.486L137.762 11.73L136.246 16.56ZM149.412 23V5.98999H153.799V23H149.412Z"
        fill="currentColor"
      />
    </svg>
  );
}
