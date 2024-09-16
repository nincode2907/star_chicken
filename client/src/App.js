import React, { useState, useEffect } from 'react'
import Lottie from "lottie-react";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import searchingAnimation from "./searching_animation.json"

const highlightKeyword = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  const highlightedText = text.replace(regex, '<mark>$1</mark>');
  return highlightedText;
};

function App() {
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [keywordSearched, setKeywordSearched] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [timeSearch, setTimeSearch] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    setSearching(true);
    try {
      const response = await fetch(`/api/v1`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      const data = result.data;
      setData(data);
    } catch (error) {
      console.log(error);
    }
    setSearching(false);
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      setKeyword(keyword.trim());
      const response = await fetch(`/api/v1/search?q=${keyword.trim()}`);
      const result = await response.json();
      const data = result.metaData.data;
      const totalResults = result.metaData.totalCount;
      const timeSearch = result.metaData.elapsedTime;
      setKeywordSearched(keyword.trim())
      setData(data);
      setTotalResults(totalResults);
      setTimeSearch(timeSearch);
    } catch (error) {
      console.log(error);
    }
    setSearching(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container-fluid px-5">
      <h1 className='my-4'>Sao kê</h1>
      <p>
        Dữ liệu được lấy từ
        <a
          className='mx-2 text-primary'
          href="https://www.facebook.com/mttqvietnam"
          target="_blank"
          rel='noreferrer'
        >MTTQ</a>
        từ ngày 01/09/2024 đến ngày 10/09/2024.
      </p>
      <p>Thực hiện bởi
        <a className='text-primary mx-1' href='https://www.facebook.com/nin.bui.5688/' target='_blank' rel='noreferrer'>Nin Bùi</a>
        &copy;2024.
      </p>
      <form className='form-inline' method='post' onSubmit={handleSearch}>
        <div className=''>
          <div className='d-flex align-items-center'>
            <div className='position-relative flex-grow-1'>
              <input className='form-control my-3 rounded-pill py-2 px-4'
                type='text'
                placeholder='Nhập số hóa đơn, số tiền hoặc nội dung...'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} />
              {searching && <div className="text-center position-absolute end-0 top-0"><Lottie className='text-center' animationData={searchingAnimation} loop={true} style={{ height: 80, width: 100 }} /></div>}
            </div>
            <div className='h-100 ms-2'>
              <button className='btn btn-primary rounded-pill px-4 py-2' type='submit'>Tìm kiếm</button>
            </div>
          </div>


        </div>
      </form>

      {totalResults !== 0 && <div>
        <h3 className=''>Kết quả tìm kiếm cho "<strong>{keywordSearched}</strong>"</h3>
        <p className=''>Hiển thị <b>{data.length}</b> kết quả trong <b>{totalResults}</b> kết quả được tìm thấy trong <b>{timeSearch}s</b></p>
      </div>
      }

      {
        totalResults === 0 && keywordSearched && <div>
          <h3 className=''>Không tìm thấy kết quả cho "<strong>{keywordSearched}</strong>"</h3>
        </div>
      }


      <table className="table table-striped table-hover mb-5">
        <thead>
          <tr>
            <th scope="col" className='column-doc-custome'>Số Hóa Đơn</th>
            <th scope="col">Trang</th>
            <th scope="col">Số tiền</th>
            <th scope="col" className='text-center'>Nội dung giao dịch</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data, i) => (
            <tr key={i}>
              <td dangerouslySetInnerHTML={{ __html: highlightKeyword(data.Doc_No, keywordSearched) }} />
              <td className='text-center'>{data.Page}</td>
              <td className='column-amount-custome'>{Number(data.Amount).toLocaleString('vi-VN')} đ</td>
              <td dangerouslySetInnerHTML={{ __html: highlightKeyword(data.Content, keywordSearched) }} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
