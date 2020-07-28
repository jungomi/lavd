from functools import wraps


class NoOp(object):
    """
    A No-Op class where the most common actions are no-ops, while also returning the
    no-op object, which allows to have chained no-ops.
    Useful to stub out an object.
    """

    def __getattr__(self, _):
        return self

    def __setattr__(self, *args, **kwargs):
        return self

    def __enter__(self, *args, **kwargs):
        return self

    def __exit__(self, *args, **kwargs):
        return self

    def __call__(self, *args, **kwargs):
        return self

    def __repr__(self):
        return "NoOp"


no_op = NoOp()


def maybe_disable(method):
    @wraps(method)
    def maybe_disabled_method(self, *args, **kwargs):
        if self.disabled:
            return no_op
        else:
            return method(self, *args, **kwargs)

    return maybe_disabled_method
