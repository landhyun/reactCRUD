import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

// React 문법 | 컴포넌트 [사용자 정의 태그] 생성
function Header(props) {
  return (
    <header>
      <h1><a href="/" onClick={event => {
        /* 여기서 React 내부 이벤트함수는 소문자로 쓰지않고 js 카멜문법을 따름 (onClick, onChangeMode 등) 
         * function () { ... }를 () => { ... }로 축약
         * preventDefault | 페이지 로드 방지
         * onChangeMode | 헤더 클릭 이벤트 | 이벤트가 일어나는 target의 id를 파라미터로 입력
         */
        event.preventDefault(); 
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  )
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++) {
    let t = props.topics[i];
    lis.push(
      <li key={t.id}>
        <a id={t.id} href={'read/' + t.id} onClick={event => { 
          event.preventDefault();
          props.onChangeMode(Number(event.target.id)); // String->Number 형변환
        }}>{t.title}</a>
      </li>
    );
  }
  return (
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props) {
    return (
      <article>
        <h2>create</h2>
        <form onSubmit={event => {
          event.preventDefault();
          const title = event.target.title.value; // form 내 name="title"의 value값
          const body = event.target.body.value; // form 내 name="body"의 value값
          props.onCreate(title, body);
        }}>
          <p><input type="text" name='title' placeholder='title'></input></p>
          <p><textarea name="body" placeholder="body"></textarea></p>
          <p><input type="submit" value="Create"></input></p>
        </form>
      </article>
    )
}
  
function Update(props) {
  // title, body 값이 변경되도록 props staging
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  
  return (
      <article>
        <h2>update</h2>
        <form onSubmit={event => {
          event.preventDefault();
          const title = event.target.title.value; // form 내 name="title"의 value값
          const body = event.target.body.value; // form 내 name="body"의 value값
          props.onUpdate(title, body);
        }}>
        <p><input type="text" name='title' placeholder='title' value={title} onChange={event => {
            setTitle(event.target.value);
          }}></input></p>
        <p><textarea name="body" placeholder="body" value={body} onChange={event => {
            setBody(event.target.value);
          }}></textarea></p>
          <p><input type="submit" value="Update"></input></p>
        </form>
      </article>
    )
}

function App() {
  /*
  const _mode = useState('WELCOME'); // useState | 지역변수이자 state의 초기값인 mode를 전역변수로 변경하는 용도로써, '상태'로 스테이징
  const mode = _mode[0]; // _mode는 배열로, 0:"WELCOME", 1:function()으로 이루어짐. 이 _mode에서 첫번째 원소인 "WELCOME"이라는 상태값을 읽어옴
  const setMode = _mode[1] // 함수이기때문에 mode의 값 변경 가능 
  */
  
  // 상단 세 줄과 동일 문법 코드
  // 값 지정 시 mode, 이벤트로 값 변경 시 setMode 변수 사용
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  
  // 다음 원소의 id값을 4로 지정
  const [nextId, setNextId] = useState(4);

  // topics useState 승격 | create로 title, body의 value가 topics에 4번 이후로 추가되어 화면에 출력되기 위함
  const [topics, setTopics] = useState([
      { id: 1, title: 'html', body: 'html is ...' }
    , { id: 2, title: 'css', body: 'css is ...' }
    , { id: 3, title: 'javascript', body: 'javascript is ...' }
  ]);

  let content = null;
  let contextControll = null;

  /* props : 컴포넌트 외부에서 사용하는 입력값
   * state : 컴포넌트 내부에서 사용하는 입력값 
   * 이벤트를 prop로 생성해 form 값 변경 시 props를 state로 전환 */

  if (mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>

  } else if (mode === 'READ') {
    let title, body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    // 각 id에 해당하는 글(read mode)을 눌렀을 경우에만 update, delete 링크 로드
    // <li> 태그를 따로 변수로 선언해 해당 경우에 호출
    content = <Article title={title} body={body}></Article>
    contextControll = <>
      <li><a href={'/update' + id} onClick={event => {
      event.preventDefault();
      setMode('UPDATE');
      }}>Update</a></li>
      
      <li><input type="button" value="Delete" onClick={() => {
        const newTopics = []
        for (let i = 0; i < topics.length; i++) {
          if (topics[i].id !== id) {
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics); // 비어있는 배열을 리스트에 추가해 삭제된 것 처럼 표시
        setMode('WELCOME');
      }}></input></li>
    </> // <> update, delete | 한 변수는 한 태그만 선언 가능. 여러 태그를 넣을 때 groping하는 빈 태그

  } else if (mode === 'CREATE') {
    content = <Create onCreate={(_title, _body) => {
      const newTopic = { id: nextId, title: _title, body: _body }
      const newTopics = [...topics] // 오리지널 topics 복제
      newTopics.push(newTopic); // 복제한 topics 변경
      setTopics(newTopics); // 변경한 topics를 set (state)

      // 여러 글 추가
      setMode('READ'); // 읽기모드로 변경
      setId(nextId); // 추가한 글 id를 nextid로 변경 
      setNextId(nextId + 1); // 다음에 추가할 글
    }}></Create>

  } else if (mode === 'UPDATE') {
    let title, body = null;

    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body) => {
      const newTopics = [...topics]
      const updatedTopic = { id: id, title: title, body: body }
      for (let i = 0; i < newTopics.length; i++) {
        if (newTopics[i].id === id) {
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }

  return (
    // 각 function Header, Nav 내 onClick 함수에서 props.onChangeMode 호출
    <div>
      <Header title="WEB" onChangeMode={() => {
        setMode('WELCOME'); // useState 문법은 변수처럼 =으로 할당하는 방식이 아닌 ()로 감싸줌
        }}>
      </Header>
      <Nav topics={topics} onChangeMode={(_id) => { 
        setMode('READ');
        setId(_id);
        }}>
      </Nav>
      {content}

      <ul>
      <li><a href='/create' onClick={event => {
        event.preventDefault(); // href를 넣었지만 url이 변경되지 않고 한 페이지 내에서 기능이 변경되도록 처리
        setMode('CREATE');
      }}>Create</a></li>
        {contextControll} 
      </ul>
    </div>
  );
}

export default App;
