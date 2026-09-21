interface Profile {
    width: number;
    height: number;
    stroke: string;
    strokeWidth: number;
}
 
export const Profile = ({width, height, stroke, strokeWidth} : Profile) => {
    return (
        <svg width={width} height={height} viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 19V17C15 15.9391 14.5786 14.9217 13.8284 14.1716C13.0783 13.4214 12.0609 13 11 13H5C3.93913 13 2.92172 13.4214 2.17157 14.1716C1.42143 14.9217 1 15.9391 1 17V19M12 5C12 7.20914 10.2091 9 8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};
 
interface Arrow {
    width: number;
    height: number;
    strokeWidth: number;
}
 
export const Arrow = ({width, height, strokeWidth} : Arrow) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 17L20 23L26 17" stroke="#33363D" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
 
interface Star {
    width: number;
    height: number;
    stroke: string;
    strokeWidth: number;
    fill?: string;
    emptyColor?: string;
    isHalf?: boolean;
}
 
export const Star = ({width, height, stroke, strokeWidth, fill, emptyColor = 'transparent', isHalf = false} : Star) => {
    const gradientId = `half-fill-${Math.random().toString(36.25).substr(2, 9)}`;
    const resolvedEmptyColor = emptyColor === 'none' ? 'transparent' : emptyColor;
 
    return (
        <svg width={width} height={height} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isHalf && fill && (
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="50%" stopColor={fill} />
                        <stop offset="50%" stopColor={resolvedEmptyColor} />
                    </linearGradient>
                </defs>
            )}
            
            <path 
                d="M7.01786 0.863344C7.04707 0.804318 7.0922 0.754632 7.14816 0.719894C7.20411 0.685156 7.26866 0.666748 7.33452 0.666748C7.40038 0.666748 7.46493 0.685156 7.52089 0.719894C7.57684 0.754632 7.62197 0.804318 7.65119 0.863344L9.19119 3.98268C9.29264 4.18799 9.4424 4.36562 9.62761 4.50031C9.81281 4.63501 10.0279 4.72275 10.2545 4.75601L13.6985 5.26001C13.7638 5.26947 13.8251 5.29699 13.8755 5.33948C13.9259 5.38196 13.9635 5.43771 13.9839 5.50041C14.0043 5.56312 14.0067 5.63028 13.9909 5.6943C13.9751 5.75832 13.9417 5.81665 13.8945 5.86268L11.4039 8.28801C11.2396 8.44808 11.1167 8.64567 11.0457 8.86376C10.9748 9.08186 10.9579 9.31394 10.9965 9.54001L11.5845 12.9667C11.596 13.0319 11.589 13.0991 11.5642 13.1605C11.5394 13.2219 11.4978 13.2751 11.4442 13.314C11.3906 13.3529 11.3272 13.376 11.2611 13.3806C11.195 13.3852 11.129 13.3711 11.0705 13.34L7.99186 11.7213C7.789 11.6148 7.56331 11.5592 7.33419 11.5592C7.10507 11.5592 6.87938 11.6148 6.67652 11.7213L3.59852 13.34C3.54008 13.371 3.47412 13.3849 3.40816 13.3802C3.34219 13.3755 3.27887 13.3524 3.22539 13.3135C3.1719 13.2746 3.13041 13.2215 3.10563 13.1602C3.08084 13.0988 3.07376 13.0318 3.08519 12.9667L3.67252 9.54068C3.71132 9.3145 3.69451 9.08228 3.62355 8.86404C3.55258 8.64581 3.4296 8.44811 3.26519 8.28801L0.774523 5.86334C0.726919 5.81737 0.693185 5.75894 0.677165 5.69473C0.661144 5.63051 0.663481 5.56309 0.683909 5.50014C0.704337 5.43719 0.742034 5.38124 0.792707 5.33867C0.843381 5.29609 0.904992 5.26861 0.970523 5.25934L4.41386 4.75601C4.64069 4.72301 4.85612 4.63538 5.04158 4.50067C5.22704 4.36596 5.37699 4.18819 5.47852 3.98268L7.01786 0.863344Z" 
                stroke={stroke} 
                strokeWidth={strokeWidth} 
                fill={isHalf ? `url(#${gradientId})` : (fill || 'none')} 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );
};
 
interface Box {
    width: number;
    height: number;
    strokeWidth: number;
    stroke?: string;
}
 
export const Box = ({width, height, strokeWidth, stroke = '#33363D'} : Box) => {
    return (
        <svg width={width} height={height} viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20.9979V10.9979M10 10.9979L1.29 5.99795M10 10.9979L18.71 5.99795M5.5 3.26795L14.5 8.41795M9 20.7279C9.30404 20.9035 9.64893 20.9959 10 20.9959C10.3511 20.9959 10.696 20.9035 11 20.7279L18 16.7279C18.3037 16.5526 18.556 16.3004 18.7315 15.9968C18.9071 15.6931 18.9996 15.3487 19 14.9979V6.99795C18.9996 6.64722 18.9071 6.30276 18.7315 5.99911C18.556 5.69546 18.3037 5.44331 18 5.26795L11 1.26795C10.696 1.09241 10.3511 1 10 1C9.64893 1 9.30404 1.09241 9 1.26795L2 5.26795C1.69626 5.44331 1.44398 5.69546 1.26846 5.99911C1.09294 6.30276 1.00036 6.64722 1 6.99795V14.9979C1.00036 15.3487 1.09294 15.6931 1.26846 15.9968C1.44398 16.3004 1.69626 16.5526 2 16.7279L9 20.7279Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};
 
interface Camera {
    width: number;
    height: number;
    strokeWidth: number;
}
 
export const Camera = ({width, height, strokeWidth} : Camera) => {
    return(
        <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.994 8C28.7156 7.99999 29.4237 8.19517 30.0434 8.56487C30.6631 8.93457 31.1712 9.46501 31.514 10.1L32.486 11.9C32.8288 12.535 33.3369 13.0654 33.9566 13.4351C34.5763 13.8048 35.2844 14 36.006 14H40C41.0609 14 42.0783 14.4214 42.8284 15.1716C43.5786 15.9217 44 16.9391 44 18V36C44 37.0609 43.5786 38.0783 42.8284 38.8284C42.0783 39.5786 41.0609 40 40 40H8C6.93913 40 5.92172 39.5786 5.17157 38.8284C4.42143 38.0783 4 37.0609 4 36V18C4 16.9391 4.42143 15.9217 5.17157 15.1716C5.92172 14.4214 6.93913 14 8 14H11.994C12.7148 14 13.4223 13.8053 14.0416 13.4363C14.6608 13.0674 15.1689 12.5379 15.512 11.904L16.49 10.096C16.8331 9.46206 17.3412 8.93262 17.9604 8.56367C18.5797 8.19471 19.2872 7.99996 20.008 8H27.994Z" stroke="#58616A" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24 32C27.3137 32 30 29.3137 30 26C30 22.6863 27.3137 20 24 20C20.6863 20 18 22.6863 18 26C18 29.3137 20.6863 32 24 32Z" stroke="#58616A" stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
 
interface Users {
    width: number;
    height: number;
    stroke: string;
    strokeWidth: number;
}
 
export const Users = ({width, height, stroke, strokeWidth} : Users) => {
    return (
        <svg width={width} height={height} viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.99998 11.4001V10.2001C8.99998 9.56358 8.74712 8.95313 8.29703 8.50304C7.84694 8.05295 7.2365 7.8001 6.59998 7.8001H2.99998C2.36346 7.8001 1.75301 8.05295 1.30292 8.50304C0.852832 8.95313 0.599976 9.56358 0.599976 10.2001V11.4001M8.99998 0.676898C9.51463 0.810319 9.97041 1.11086 10.2958 1.53134C10.6212 1.95181 10.7977 2.46843 10.7977 3.0001C10.7977 3.53176 10.6212 4.04838 10.2958 4.46886C9.97041 4.88934 9.51463 5.18988 8.99998 5.3233M12.6 11.4001V10.2001C12.5996 9.66833 12.4226 9.15176 12.0968 8.73149C11.771 8.31121 11.3149 8.01104 10.8 7.8781M7.19998 3.0001C7.19998 4.32558 6.12546 5.4001 4.79998 5.4001C3.47449 5.4001 2.39998 4.32558 2.39998 3.0001C2.39998 1.67461 3.47449 0.600098 4.79998 0.600098C6.12546 0.600098 7.19998 1.67461 7.19998 3.0001Z" stroke={stroke} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
 
interface MapPinIcon {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
    innerRadius?: number;
}
 
export const MapPin = ({ width = 18, height = 22, stroke = '#4576F7', strokeWidth = 2, innerRadius = 3 }: MapPinIcon) => {
    return (
        <svg width={width} height={height} viewBox={`0 0 18 22`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M9.601 20.799C11.461 19.193 17 13.993 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1C6.87827 1 4.84344 1.84285 3.34315 3.34315C1.84285 4.84344 1 6.87827 1 9C1 13.993 6.539 19.193 8.399 20.799C8.57228 20.9293 8.7832 20.9998 9 20.9998C9.2168 20.9998 9.42772 20.9293 9.601 20.799Z" 
                fill={stroke} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
            />
            <circle cx="9" cy="9" r={innerRadius} fill="white" stroke="white" strokeWidth={strokeWidth} />
        </svg>
    );
};
 
interface Calendar {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Calendar = ({ width = 14, height = 15, stroke = '#6B7280', strokeWidth = 1.2 }: Calendar) => {
    return (
        <svg width={width} height={height} viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.08333 0.75V2.75M9.41667 0.75V2.75M0.75 5.41667H12.75M4.08333 8.08333H4.09M6.75 8.08333H6.75667M9.41667 8.08333H9.42333M4.08333 10.75H4.09M6.75 10.75H6.75667M9.41667 10.75H9.42333M2.08333 1.41667H11.4167C12.153 1.41667 12.75 2.01362 12.75 2.75V12.0833C12.75 12.8197 12.153 13.4167 11.4167 13.4167H2.08333C1.34695 13.4167 0.75 12.8197 0.75 12.0833V2.75C0.75 2.01362 1.34695 1.41667 2.08333 1.41667Z" stroke={stroke} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
 
interface Clock {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Clock = ({ width = 14, height = 15, stroke = '#6B7280', strokeWidth = 1.2 }: Clock) => {
    return (
        <svg width={width} height={height} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.41667 3.41667V7.41667H10.0833M14.0833 7.41667C14.0833 11.0986 11.0986 14.0833 7.41667 14.0833C3.73477 14.0833 0.75 11.0986 0.75 7.41667C0.75 3.73477 3.73477 0.75 7.41667 0.75C11.0986 0.75 14.0833 3.73477 14.0833 7.41667Z" stroke={stroke} stroke-width={strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
 
interface Circle {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Circle = ({ width = 20, height = 20, stroke = '#4576F7', strokeWidth = 4 }: Circle) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
    );
};
 
interface FileText {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const FileText = ({ width = 12, height = 12, stroke = '#6B7280', strokeWidth = 2 }: FileText) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 13H8M16 17H8M10 9H8" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
    );
};
 
interface MapPinOutline {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
}
 
export const MapPinOutline = ({ width = 20, height = 24, stroke = '#4B5663', strokeWidth = 2 }: MapPinOutline) => {
  return (
    <svg width={width} height={height} viewBox="0 0 18 22" fill="none">
      <path d="M9.601 20.799C11.461 19.193 17 13.993 17 9C17 4.58272 13.4183 1 9 1C4.58172 1 1 4.58272 1 9C1 13.993 6.539 19.193 8.399 20.799C8.57228 20.9293 8.7832 20.9998 9 20.9998C9.2168 20.9998 9.42772 20.9293 9.601 20.799Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="9" r="3" stroke={stroke} strokeWidth={strokeWidth}/>
    </svg>
  )
}
 
interface Dot {
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
}
 
export const Dot = ({ width = 20, height = 20, fill = 'white',stroke = '#6A6A67' }: Dot) => {
    return ( 
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx={width/2} cy={height/2} r={width/2} fill={stroke} />
            <circle cx={width/2} cy={height/2} r={width/4} fill={fill} />
        </svg>
    );
};
 
interface Recipe {
    width?: number;
    height?: number;
    stroke?: string;
}
 
export const Recipe = ({ width = 10, height = 12, stroke = '#6A6A67' }: Recipe) => {
    return ( 
        <svg width={width} height={height} viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5625 0.562502H1.5625C1.29728 0.562502 1.04293 0.667858 0.855393 0.855395C0.667857 1.04293 0.5625 1.29729 0.5625 1.5625V9.5625C0.5625 9.82772 0.667857 10.0821 0.855393 10.2696C1.04293 10.4571 1.29728 10.5625 1.5625 10.5625H7.5625C7.82772 10.5625 8.08207 10.4571 8.26961 10.2696C8.45714 10.0821 8.5625 9.82772 8.5625 9.5625V3.5625M5.5625 0.562502C5.72078 0.562245 5.87754 0.593303 6.02377 0.653886C6.16999 0.714469 6.30278 0.803381 6.4145 0.915502L8.2085 2.7095C8.32092 2.82125 8.41009 2.95417 8.47085 3.10058C8.53161 3.24699 8.56276 3.40399 8.5625 3.5625M5.5625 0.562502V3.0625C5.5625 3.19511 5.61518 3.32229 5.70895 3.41605C5.80271 3.50982 5.92989 3.5625 6.0625 3.5625L8.5625 3.5625M3.5625 4.0625H2.5625M6.5625 6.0625H2.5625M6.5625 8.0625H2.5625" stroke={stroke} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
 
interface XButton{
    width: number;
    height: number;
    strokeWidth: number;
}
 
export const XButton = () => {
    return(
            <div className="x-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#6A6A67" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
 
    )
}
 
 
interface Wallet {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Wallet = ({ width = 20, height = 20, stroke = '#6B7280', strokeWidth = 2 }: Wallet) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};
 
interface Eye {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Eye = ({ width = 24, height = 24, stroke = '#6A6A67', strokeWidth = 2 }: Eye) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};
 
interface EyeOff {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const EyeOff = ({ width = 24, height = 24, stroke = '#6A6A67', strokeWidth = 2 }: EyeOff) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m2 2 20 20" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
};
 
interface CircleCheck {
    width?: number;
    height?: number;
    fill?: string;
    check?: string;
}
 
export const CircleCheck = ({ width = 24, height = 24, fill = '#FD5D35', check = '#FFFFFF' }: CircleCheck) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill={fill} />
            <path d="m8 12 2.5 2.5 5.5-5.5" stroke={check} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
interface Truck {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Truck = ({ width = 24, height = 24, stroke = '#4576F7', strokeWidth = 2 }: Truck) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 18H9" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="17" cy="18" r="2" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="7" cy="18" r="2" stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
    );
};
 
interface CircleEmpty {
    width?: number;
    height?: number;
    color?: string;
}
 
export const CircleEmpty = ({ width = 24, height = 24, color = '#6A6A67' }: CircleEmpty) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" fill={color} />
            <circle cx="12" cy="12" r="5" fill="#FFFFFF" />
        </svg>
    );
};
 
interface CircleX {
    width?: number;
    height?: number;
    fill?: string;
    x?: string;
}
 
// 진행 단계 취소/중단 표시 (주황 원 + 흰 X)
export const CircleX = ({ width = 24, height = 24, fill = '#FD5D35', x = '#FFFFFF' }: CircleX) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill={fill} />
            <path d="m9 9 6 6M15 9l-6 6" stroke={x} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
/* ---------- 아코디언 (+ / −) ---------- */
interface Plus {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Plus = ({ width = 24, height = 24, stroke = '#6A6A67', strokeWidth = 2 }: Plus) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M12 5V19" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
interface Minus {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Minus = ({ width = 24, height = 24, stroke = '#6A6A67', strokeWidth = 2 }: Minus) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
/* ---------- 아래 방향 화살표 (프로필 카드 등) ---------- */
interface ChevronDown {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const ChevronDown = ({ width = 24, height = 24, stroke = '#33363D', strokeWidth = 2 }: ChevronDown) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m6 9 6 6 6-6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
/* ---------- 결제정보 (카드) ---------- */
interface CreditCard {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const CreditCard = ({ width = 20, height = 20, stroke = '#FD5D35', strokeWidth = 2 }: CreditCard) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="14" x="2" y="5" rx="2" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <line x1="2" x2="22" y1="10" y2="10" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
/* ---------- 알림 (확성기) ---------- */
interface Megaphone {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Megaphone = ({ width = 24, height = 24, stroke = '#FD5D35', strokeWidth = 2 }: Megaphone) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m3 11 18-5v12L3 14v-3z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
/* ---------- 마이페이지 ---------- */
interface ThumbsUp {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const ThumbsUp = ({ width = 24, height = 24, stroke = '#33363D', strokeWidth = 2 }: ThumbsUp) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10v12" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
interface Edit {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Edit = ({ width = 24, height = 24, stroke = '#33363D', strokeWidth = 2 }: Edit) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
interface ChevronRight {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const ChevronRight = ({ width = 24, height = 24, stroke = '#33363D', strokeWidth = 2 }: ChevronRight) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="m9 18 6-6-6-6" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
 
interface Logout {
    width?: number;
    height?: number;
    stroke?: string;
    strokeWidth?: number;
}
 
export const Logout = ({ width = 24, height = 24, stroke = '#33363D', strokeWidth = 2 }: Logout) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="m16 17 5-5-5-5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};