import pytest


@pytest.fixture
def name():
    return "foo.stark"


@pytest.fixture
def subdomain():
    return "bar."


@pytest.fixture
def address():
    return 3139084549856436378687393015680186785185683929880547773483526600592946091349
