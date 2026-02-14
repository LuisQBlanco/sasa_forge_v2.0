def test_login_and_me(client):
    r = client.post("/auth/login", json={"email": "admin@test.com", "password": "admin123"})
    assert r.status_code == 200
    token = r.json()["access_token"]

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "admin@test.com"
