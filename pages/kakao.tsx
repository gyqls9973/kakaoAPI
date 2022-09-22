import {useEffect, useState} from "react";
import styled from '@emotion/styled';

interface MapProps {
    latitude: number;
    longitude: number;
}

function Map({latitude, longitude}: MapProps) {
    const [kakaoLating, setKakoLating] = useState({lat: 35.14668438859065, lng: 126.84733058734534}); //경도, 위도 가져오기(임시 기본값: 세정아울렛)

    //geolocation으로 마커 표시하기
    const displayMarker = (locPosition, message) => {
        const container = document.getElementById("map");
        const options = {center: new window.kakao.maps.LatLng(35.14668438859065, 126.84733058734534),};
        const map = new window.kakao.maps.Map(container, options);
        const marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition
        });
        const infowindow = new window.kakao.maps.InfoWindow({
            content: message,
            removavle: true
        });
        infowindow.open(map, marker);
        map.setCenter(locPosition);
    };

    //geolocation 위치 찾기
    const myLat = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const lat = 35.16015604139172;//position.coords.latitude
                const lon = 126.85162986081089; //position.coords.longitude
                const locPosition = new window.kakao.maps.LatLng(lat, lon);
                const message = '<div style="padding: 5px">광주 시청 위치</div>'
                displayMarker(locPosition, message);
                console.log(locPosition);
            })
        }
    }

    //로드뷰 보기
    const roadView = () => {
        const roadViewContainer = document.getElementById("roadView");
        const roadView = new window.kakao.maps.Roadview(roadViewContainer); //로드뷰 객체
        const roadViewClient = new window.kakao.maps.RoadviewClient(); //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

        const position = new window.kakao.maps.LatLng(35.14668438859065, 126.84733058734534);
        roadViewClient.getNearestPanoId(position, 50, function (panold) {
            roadView.setPanoId(panold, position);
        })
    }

    useEffect(() => {
        //kakao map appkey 받아오기
        const mapScript = document.createElement("script");
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAOMAP_APPKEY}&libraries=services,clusterer,drawing&autoload=false`; //
        document.head.appendChild(mapScript);

        //카카오 지도 api 불러오기
        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById("map");
                const options = {center: new window.kakao.maps.LatLng(35.14668438859065, 126.84733058734534),};
                const map = new window.kakao.maps.Map(container, options);
                const markerPosition = new window.kakao.maps.LatLng(35.14668438859065, 126.84733058734534);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);

                // 지도 클릭시 마커 이동
                window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
                    const lating = mouseEvent.latLng;
                    setKakoLating({lat: lating.getLat(), lng: lating.getLng()});
                    marker.setPosition(lating);
                    const message = `클릭한 위치의 경도는 ${lating.getLat()}이고, 경도는 ${lating.getLng()}입니다.`;
                    document.getElementById('clickLating').innerHTML = message;
                })
            });
        };

        mapScript.addEventListener("load", onLoadKakaoMap);
        return () => mapScript.removeEventListener("load", onLoadKakaoMap);
    }, [latitude, longitude]);

    return (
        <>
            <MapContainer id="map" /> {/*지도 뿌려주기*/}
            <DivStyle id="clickLating"/> {/*지도 클릭시 해당 경도, 위도값 노출*/}
            <DivStyle><a href={`https://map.kakao.com/link/to/세정아울렛,${kakaoLating.lat},${kakaoLating.lng}`}>세정아울렛 길찾기(카카오 오픈API의 경우 길찾기 기능 제공X - 카카오맵으로 연동)</a></DivStyle>
            <DivStyle onClick={myLat}>광주 시청 찾기</DivStyle>
            <DivStyle onClick={roadView}>세정아울렛 로드뷰 보기</DivStyle>
            <MapContainer id="roadView"/>
        </>
    );
}

declare global {
    interface Window {
        kakao: any;
    }
}

const MapContainer = styled.div`
  aspect-ratio: 320 / 220;
  width: 800px;
  heigth: 600px;
`;

const DivStyle = styled.div`
  font-size: 20px;
  border-radius: 4px;
  padding: 16px
  text-align: center;
  &:hover {
  color: blue;
  }
`

export default Map;