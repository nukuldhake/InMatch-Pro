from pydantic import BaseModel
from typing import Optional

class PlayerBase(BaseModel):
    id: int
    name: str
    team: str
    role: str 