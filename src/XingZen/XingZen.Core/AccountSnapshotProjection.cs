using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace XingZen.Core
{
    public class AccountSnapshotProjection
    {
        public int Sequence { get; private set; }

        public decimal Balance { get; private set; }

        public DateTime LastSync { get; private set; }
    }
}
