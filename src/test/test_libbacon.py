import pytest
from ..libbacon import bacon_number, did_bacon_work_with, movies_starring_bacon_and

@pytest.mark.parametrize("actor_name", ["Frankie Muniz", "Sarah Jessica Parker"])
def test_did_bacon_work_with_true(actor_name: str):
    assert did_bacon_work_with(actor_name) == True

@pytest.mark.parametrize("actor_name", ["Sigourney Weaver", "Miranda Cosgrove"])
def test_did_bacon_work_with_false(actor_name: str):
    assert did_bacon_work_with(actor_name) == False

@pytest.mark.parametrize("actor_name", ["Frankie Muniz", "Sarah Jessica Parker"])
def test_bacon_number_eq_1(actor_name: str):
    assert bacon_number(actor_name) == 1

@pytest.mark.parametrize("actor_name", ["Sigourney Weaver", "Miranda Cosgrove"])
def test_bacon_number_gt_1(actor_name: str):
    assert bacon_number(actor_name) == 2

@pytest.mark.parametrize("actor_name", ["Sigourney Weaver","Miranda Cosgrove"])
def test_no_movies_starring_bacon_and(actor_name: str):
    assert len(movies_starring_bacon_and(actor_name)) == 0

@pytest.mark.parametrize("actor_name", ["Frankie Muniz", "Sarah Jessica Parker"])
def test_movies_starring_bacon_and(actor_name: str):
    assert len(movies_starring_bacon_and(actor_name)) == 1
