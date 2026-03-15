import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Anchorinit } from "../../../target/types/anchorinit";
import idl from "../../../target/idl/anchorinit.json";

const connection = new anchor.web3.Connection("http://127.0.0.1:8899", "confirmed");

