import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import HorizontalRule from "../components/HorizontalRule";
import Link from "../components/Link";
import GoogleImage from "../assets/google.svg";
import styles from "./RegisterPage.module.css";
import { useToaster } from "../contexts/ToasterProvider";
import { useAuth } from "../contexts/AuthProvider";

function RegisterPage() {
  const [initialAvatar, setInitialAvatar] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const navigate = useNavigate();

  async function getMe() {
    const res = await axios.get("/users/me");
    const nextUser = res.data;
    const { avatar, name, email, bio } = nextUser;
    setValues({ name, email, bio });
    setInitialAvatar(avatar);
  }

  const toast = useToaster();
  const { user, login } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  // 홈페이지에서 입력한 데이터를 처리
  async function handleSubmit(e) {
    e.preventDefault();

    if (values.password !== values.passwordRepeat) {
      toast("warn", "비밀번호가 일치하지 않습니다.");
      return;
    }

    const { name, email, password } = values;

    /**
     * @TODO
     * 서버에 회원을 생성
     * 회원 생성이 성공하면 로그인 시도
     * 로그인이 성공하면 `/me`로 이동
     */
    // values라는 state 값을 서버로 보냄
    // axios를 사용해서 POST Request를 보냄
    axios.post("/users", {
      name,
      email,
      password,
    });
  }

  useEffect(() => {
    if (user) navigate("/me");
  }, [user, navigate]);

  return (
    <>
      <h1 className={styles.Heading}>회원가입</h1>
      <Button
        className={styles.GoogleButton}
        type="button"
        appearance="outline"
        as={Link}
        to="/api/auth/google"
        reloadDocument
      >
        <img src={GoogleImage} alt="Google" />
        구글로 시작하기
      </Button>
      <HorizontalRule className={styles.HorizontalRule}>또는</HorizontalRule>
      <form className={styles.Form} onSubmit={handleSubmit}>
        <Label className={styles.Label} htmlFor="name">
          이름
        </Label>
        <Input
          id="name"
          className={styles.Input}
          name="name"
          type="text"
          placeholder="김링크"
          value={values.name}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="email">
          이메일
        </Label>
        <Input
          id="email"
          className={styles.Input}
          name="email"
          type="email"
          placeholder="example@email.com"
          value={values.email}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="password">
          비밀번호
        </Label>
        <Input
          id="password"
          className={styles.Input}
          name="password"
          type="password"
          placeholder="비밀번호"
          value={values.password}
          onChange={handleChange}
        />
        <Label className={styles.Label} htmlFor="passwordRepeat">
          비밀번호 확인
        </Label>
        <Input
          id="passwordRepeat"
          className={styles.Input}
          name="passwordRepeat"
          type="password"
          placeholder="비밀번호 확인"
          value={values.passwordRepeat}
          onChange={handleChange}
        />
        <Button className={styles.Button}>회원가입</Button>
        <div>
          이미 회원이신가요? <Link to="/login">로그인하기</Link>
        </div>
      </form>
    </>
  );
}

export default RegisterPage;
