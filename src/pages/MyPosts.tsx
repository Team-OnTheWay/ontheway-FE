import './MyPosts.css'
import { useEffect, useState } from 'react'
import { useAsync } from '../hooks/useAsync'
import CustomTopAppBar from '../components/CustomTopAppBar'
import CustomTab from '../components/CustomTab'
import CustomFilterBar from '../components/CustomFilterBar'
import CustomDeliveryCard from '../components/CustomDeliveryCard'
import CustomProductCard from '../components/CustomProductCard'
import CustomFab from '../components/CustomFab'
import CustomNavBar from '../components/CustomNavBar'
import CustomDiv from '../components/CustomDiv'
import { SearchIcon } from '../components/CustomIcon'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Delivery } from '../api/Delivery'
import { Product } from '../api/Product'
import { EMPTY_FILTERS, filterQuery, type FilterValues } from '../utils/filter'
import { errorMessage, formatDate, formatNumber, formatTime } from '../utils/apiFormat'

type LoadState = 'loading' | 'done' | 'error'
const stateOf = (r: { loading: boolean; error?: unknown }): LoadState => r.loading ? 'loading' : r.error ? 'error' : 'done'

function MyPosts(){
    // /my/post?tab=1 로 들어오면 배송의뢰 탭부터 (배송의뢰 작성완료 후)
    const [searchParams] = useSearchParams()
    const [tab,setTab]=useState(searchParams.get('tab') === '1' ? 1 : 0)
    const navigate = useNavigate();

    // 가는길: 내가 올린 이동 경로 (필터 적용)
    const [filters, setFilters] = useState<FilterValues>(EMPTY_FILTERS)
    const routeResult = useAsync(
        () => tab !== 0 ? Promise.resolve([]) : new Delivery()
            .myList({ myBoardDeliveryListRequestDto: { ...filterQuery(filters), page: 0, size: 50 } })
            .then(res => res.data.data?.deliveryList ?? []),
        `${tab}:${JSON.stringify(filters)}`,
    )
    const routes = routeResult.data ?? []
    const routeState = stateOf(routeResult)

    // 배송의뢰: 내가 올린 물품 (검색어는 입력을 멈춘 뒤 0.3초 후에 조회)
    const [keyword, setKeyword] = useState('')
    const [debouncedKeyword, setDebouncedKeyword] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedKeyword(keyword.trim()), 300)
        return () => clearTimeout(timer)
    }, [keyword])
    const productResult = useAsync(
        () => tab !== 1 ? Promise.resolve([]) : new Product()
            .list1({ productListRequestDto: { keyword: debouncedKeyword || undefined, page: 0, size: 50 } })
            .then(res => res.data.data?.productList ?? []),
        `${tab}:${debouncedKeyword}`,
    )
    const products = productResult.data ?? []
    const productState = stateOf(productResult)
    const error = errorMessage(routeResult.error ?? productResult.error, '게시글을 불러오지 못했어요.')

    const message = (state: LoadState, empty: boolean, emptyText: string) =>
        state === 'loading' ? <p className="list-message">불러오는 중이에요.</p>
        : state === 'error' ? <p className="list-message">{error}</p>
        : empty ? <p className="list-message">{emptyText}</p>
        : null

    return(
        <CustomDiv backgroundColor={'#F3F4F6'} footerElement={<CustomNavBar initialActive="posts"/>}>
            <CustomTopAppBar variant="title" title="내 게시글"/>

            <div className="my-posts__body">
                <CustomTab tabs={['가는길','배송의뢰']} activeIndex={tab} onChange={setTab}/>

                {tab===0 ? (
                    <>
                        <CustomFilterBar className="my-posts__filters" onChange={setFilters}/>

                        <div className="my-posts__cards">
                            {message(routeState, routes.length === 0, '등록한 이동 경로가 없어요.')}
                            {routeState === 'done' && routes.map(route => (
                                <CustomDeliveryCard
                                    key={route.deliveryId}
                                    id={route.deliveryId ?? 0}
                                    count={route.requestCount ?? 0}
                                    startAddr={route.startAddress ?? ''}
                                    endAddr={route.endAddress ?? ''}
                                    date={formatDate(route.deliveryDate)}
                                    startTime={formatTime(route.deliveryDate)}
                                    price={formatNumber(route.hopePrice)}
                                />
                            ))}
                        </div>
                    </>
                            ) : (
                    <>
                        <div className="my-posts__search">
                            <SearchIcon />
                            <input placeholder="물품명으로 검색해보세요." value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                        </div>

                        <div className="my-posts__products">
                            {message(productState, products.length === 0, keyword ? '검색 결과가 없어요.' : '등록한 배송 의뢰가 없어요.')}
                            {productState === 'done' && products.map(product => (
                                <CustomProductCard
                                    key={product.productId}
                                    number={`물품번호 ${product.productSerialNumber ?? ''}`}
                                    category={product.productName ?? ''}
                                    money={formatNumber(product.deliveryPrice)}
                                    onClick={() => navigate(`/product/detail/${product.productId}`)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {tab===1 && (
                <div className="my-posts__fab">
                    <CustomFab onClick={() => navigate('/product/write')}/>
                </div>
            )}
        </CustomDiv>
    )
}

export default MyPosts
