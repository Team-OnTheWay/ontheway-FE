import { type ReactNode } from 'react';
import { Star } from './CustomIcon';
import './CustomReviewCard.css'

interface CustomReviewCard {
    profileElement: ReactNode;
    nickname: string;
    date: string;
    rating: number;
    content: string;
}

function CustomReviewCard({profileElement, nickname, date, rating, content}: CustomReviewCard) {
  const renderStars = (currentRating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (currentRating >= i) {
        stars.push(
          <Star key={i} width={16} height={16} stroke={'#FD5D35'} strokeWidth={1.5} fill={'#FD5D35'} isHalf={false} />
        );
      } else if (currentRating >= i - 0.5) {
        stars.push(
          <Star key={i} width={16} height={16} stroke={'#FD5D35'} strokeWidth={1.5} fill={'#FD5D35'} emptyColor={'none'} isHalf={true} />
        );
      } else {
        stars.push(
          <Star key={i} width={16} height={16} stroke={'#D7DAE0'} strokeWidth={1.5} fill={'none'} isHalf={false} />
        );
      }
    }
    return stars;
  };

  return (
    <>
        <div className="custom-review">
            <div>
                <div className='review-profile-info'>
                    <div className='review-profile-title'>
                      <div className='review-profile-content'>
                          {profileElement}          
                      </div>
                      <div>
                        <span className='review-nickname'>{nickname}</span>
                      </div>
                    </div>
                    <div>
                        <span className='reivew-date'>{date}</span>
                    </div>
                </div>
            </div>
            <div>
                <div className='review-star-info'>
                    <div>
                        {renderStars(rating)}
                    </div>
                    <span className='rating-number'>{rating.toFixed(1)}</span>
                </div>
            </div>
            <div>
                <span className='review-content'>{content}</span>
            </div>
        </div>
    </>
  )
}

export default CustomReviewCard