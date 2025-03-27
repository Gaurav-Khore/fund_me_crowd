export type FundMeCrowd = {
  "version": "0.1.0",
  "name": "fund_me_crowd",
  "instructions": [
    {
      "name": "intializeApp",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "allCampaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeCampaign",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userCampaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "allCampaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignTransaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "goalAmt",
          "type": "u64"
        },
        {
          "name": "days",
          "type": "i64"
        },
        {
          "name": "imgUrl",
          "type": "string"
        }
      ]
    },
    {
      "name": "tierCreate",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierName",
          "type": "string"
        },
        {
          "name": "tierAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeTier",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierIndex",
          "type": "u16"
        }
      ]
    },
    {
      "name": "fundCampaign",
      "accounts": [
        {
          "name": "backer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignTransactionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawCampaign",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "refundCampaign",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignTransactionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteCampaign",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "backerAccountClose",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backerAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaignAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "goalAmount",
            "type": "u64"
          },
          {
            "name": "currentAmount",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tiers",
            "type": {
              "vec": {
                "defined": "Tier"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "CampaignStatus"
            }
          },
          {
            "name": "imageUrl",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "backerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignList",
            "type": {
              "vec": {
                "defined": "Backer"
              }
            }
          }
        ]
      }
    },
    {
      "name": "allCampaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignList",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "userCampaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaigns",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "treasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignTransaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transactionList",
            "type": {
              "vec": {
                "defined": "Transactions"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Backer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "refundStatus",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Transactions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "backer",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "CampaignStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Successful"
          },
          {
            "name": "Failed"
          },
          {
            "name": "InActive"
          },
          {
            "name": "Completed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAuthorized"
    },
    {
      "code": 6001,
      "name": "NotAllowedTierMoreThanGoalAmount"
    },
    {
      "code": 6002,
      "name": "DuplicateTier"
    },
    {
      "code": 6003,
      "name": "TiersMaxLenReached"
    },
    {
      "code": 6004,
      "name": "MaxAmountReached"
    },
    {
      "code": 6005,
      "name": "CampaignInActive"
    },
    {
      "code": 6006,
      "name": "GoalNotAchieved"
    },
    {
      "code": 6007,
      "name": "NoRefundInititated"
    },
    {
      "code": 6008,
      "name": "CampaignIsActive"
    }
  ]
};

export const IDL: FundMeCrowd = {
  "version": "0.1.0",
  "name": "fund_me_crowd",
  "instructions": [
    {
      "name": "intializeApp",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "allCampaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeCampaign",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userCampaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "allCampaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignTransaction",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "goalAmt",
          "type": "u64"
        },
        {
          "name": "days",
          "type": "i64"
        },
        {
          "name": "imgUrl",
          "type": "string"
        }
      ]
    },
    {
      "name": "tierCreate",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierName",
          "type": "string"
        },
        {
          "name": "tierAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "removeTier",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierIndex",
          "type": "u16"
        }
      ]
    },
    {
      "name": "fundCampaign",
      "accounts": [
        {
          "name": "backer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignTransactionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tierIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawCampaign",
      "accounts": [
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "refundCampaign",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "backerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "campaignTransactionAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "deleteCampaign",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "campaignAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "backerAccountClose",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backerAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "campaignAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "goalAmount",
            "type": "u64"
          },
          {
            "name": "currentAmount",
            "type": "u64"
          },
          {
            "name": "duration",
            "type": "i64"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "tiers",
            "type": {
              "vec": {
                "defined": "Tier"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": "CampaignStatus"
            }
          },
          {
            "name": "imageUrl",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "backerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignList",
            "type": {
              "vec": {
                "defined": "Backer"
              }
            }
          }
        ]
      }
    },
    {
      "name": "allCampaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignList",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "userCampaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaigns",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "treasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignTransaction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "transactionList",
            "type": {
              "vec": {
                "defined": "Transactions"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Tier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Backer",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "refundStatus",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Transactions",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "backer",
            "type": "publicKey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "CampaignStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Active"
          },
          {
            "name": "Successful"
          },
          {
            "name": "Failed"
          },
          {
            "name": "InActive"
          },
          {
            "name": "Completed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAuthorized"
    },
    {
      "code": 6001,
      "name": "NotAllowedTierMoreThanGoalAmount"
    },
    {
      "code": 6002,
      "name": "DuplicateTier"
    },
    {
      "code": 6003,
      "name": "TiersMaxLenReached"
    },
    {
      "code": 6004,
      "name": "MaxAmountReached"
    },
    {
      "code": 6005,
      "name": "CampaignInActive"
    },
    {
      "code": 6006,
      "name": "GoalNotAchieved"
    },
    {
      "code": 6007,
      "name": "NoRefundInititated"
    },
    {
      "code": 6008,
      "name": "CampaignIsActive"
    }
  ]
};
